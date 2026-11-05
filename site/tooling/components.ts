import ts from 'typescript';

export interface PropEntry {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
}

export interface ComponentEntry {
  name: string;
  category: string;
  description: string;
  importLine: string;
  module: string;
  props: PropEntry[];
}

export interface StoryMeta {
  title: string;
  description: string;
}

const findProperty = (node: ts.ObjectLiteralExpression, name: string) =>
  node.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && property.name.getText() === name,
  );

const unwrapExpression = (node: ts.Expression): ts.Expression => {
  if (
    ts.isSatisfiesExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isParenthesizedExpression(node)
  ) {
    return unwrapExpression(node.expression);
  }
  return node;
};

const stringFrom = (node: ts.Expression | undefined): string | null => {
  if (!node) return null;
  const expression = unwrapExpression(node);
  if (ts.isStringLiteralLike(expression)) return expression.text;
  if (
    ts.isCallExpression(expression) &&
    ts.isPropertyAccessExpression(expression.expression) &&
    expression.expression.name.text === 'join' &&
    ts.isArrayLiteralExpression(expression.expression.expression)
  ) {
    const separatorNode = expression.arguments[0];
    const separator =
      separatorNode && ts.isStringLiteralLike(separatorNode) ? separatorNode.text : ',';
    const parts = expression.expression.expression.elements.map((element) =>
      ts.isStringLiteralLike(element) ? element.text : '',
    );
    return parts.join(separator);
  }
  return null;
};

export const readStoryMeta = (source: string): StoryMeta | null => {
  const file = ts.createSourceFile('story.tsx', source, ts.ScriptTarget.Latest, true);
  let meta: StoryMeta | null = null;
  const visit = (node: ts.Node) => {
    if (meta) return;
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'meta' && node.initializer) {
      const literal = unwrapExpression(node.initializer);
      if (ts.isObjectLiteralExpression(literal)) {
        const title = stringFrom(findProperty(literal, 'title')?.initializer) ?? '';
        const parameters = findProperty(literal, 'parameters')?.initializer;
        const docs =
          parameters && ts.isObjectLiteralExpression(parameters)
            ? findProperty(parameters, 'docs')?.initializer
            : undefined;
        const description =
          docs && ts.isObjectLiteralExpression(docs)
            ? findProperty(docs, 'description')?.initializer
            : undefined;
        const component =
          description && ts.isObjectLiteralExpression(description)
            ? stringFrom(findProperty(description, 'component')?.initializer)
            : null;
        meta = { title, description: component ?? '' };
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return meta;
};

export const splitDescription = (description: string) => {
  const lines = description.split('\n');
  const importLine = lines.find((line) => line.startsWith('Import:')) ?? '';
  const prose = lines
    .filter((line) => !line.startsWith('Import:'))
    .join('\n')
    .trim();
  return {
    prose,
    importLine: importLine.replace(/^Import:\s*/, '').replace(/^`|`$/g, ''),
  };
};

const defaultsFromComponent = (declaration: ts.Node): Map<string, string> => {
  const defaults = new Map<string, string>();
  let found = false;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      const [firstParameter] = node.parameters;
      if (firstParameter && ts.isObjectBindingPattern(firstParameter.name)) {
        found = true;
        firstParameter.name.elements.forEach((element) => {
          if (!element.initializer) return;
          const propertyName = (element.propertyName ?? element.name).getText();
          defaults.set(propertyName, element.initializer.getText());
        });
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(declaration);
  return defaults;
};

const normalizeType = (text: string) => text.replace(/\s+/g, ' ').replace(/^\| /, '').trim();

const sentenceCase = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : text;

export const extractComponents = (
  entryFile: string,
  packageSourceDir: string,
  storyMetaFor: (moduleName: string) => StoryMeta | null,
): ComponentEntry[] => {
  const program = ts.createProgram([entryFile], {
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    strictNullChecks: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(entryFile);
  if (!entry) return [];
  const moduleSymbol = checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) return [];
  const exports = checker.getExportsOfModule(moduleSymbol);
  const exportNames = new Set(exports.map((symbol) => symbol.getName()));
  const isOwnDeclaration = (declaration: ts.Declaration) =>
    declaration.getSourceFile().fileName.startsWith(packageSourceDir);

  const moduleOfExport = new Map<string, string>();
  entry.statements.forEach((statement) => {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) return;
    const specifier = (statement.moduleSpecifier as ts.StringLiteral).text;
    const moduleName = specifier.replace(/^\.\//, '').split('/')[0];
    const reexported = checker.getSymbolAtLocation(statement.moduleSpecifier);
    if (!reexported) return;
    checker.getExportsOfModule(reexported).forEach((symbol) => {
      moduleOfExport.set(symbol.getName(), moduleName);
    });
  });

  const typeTextFor = (typeNode: ts.TypeNode): string => {
    if (ts.isTypeReferenceNode(typeNode) && !typeNode.typeArguments) {
      const referenced = checker.getSymbolAtLocation(typeNode.typeName);
      const target =
        referenced && referenced.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(referenced)
          : referenced;
      const aliasDeclaration = target?.declarations?.[0];
      if (
        aliasDeclaration &&
        ts.isTypeAliasDeclaration(aliasDeclaration) &&
        isOwnDeclaration(aliasDeclaration) &&
        ts.isUnionTypeNode(aliasDeclaration.type)
      ) {
        return normalizeType(aliasDeclaration.type.getText());
      }
    }
    return normalizeType(typeNode.getText());
  };

  const propsFor = (propsName: string): PropEntry[] => {
    const symbol = exports.find((candidate) => candidate.getName() === propsName);
    if (!symbol) return [];
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const type = checker.getDeclaredTypeOfSymbol(target);
    return checker
      .getPropertiesOfType(type)
      .map((property) => {
        const declaration = property.declarations?.[0];
        if (!declaration || !isOwnDeclaration(declaration)) return null;
        const typeText =
          ts.isPropertySignature(declaration) && declaration.type
            ? typeTextFor(declaration.type)
            : checker.typeToString(checker.getTypeOfSymbolAtLocation(property, declaration));
        return {
          name: property.getName(),
          type: typeText,
          optional: Boolean(property.flags & ts.SymbolFlags.Optional),
        };
      })
      .filter((prop): prop is PropEntry => prop !== null);
  };

  const components = exports
    .filter(
      (symbol) => /^[A-Z]/.test(symbol.getName()) && exportNames.has(`${symbol.getName()}Props`),
    )
    .map((symbol) => {
      const name = symbol.getName();
      const target =
        symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      const declaration = target.declarations?.[0];
      const defaults = declaration ? defaultsFromComponent(declaration) : new Map<string, string>();
      const moduleName = moduleOfExport.get(name) ?? name;
      const meta = storyMetaFor(moduleName);
      const { prose, importLine } = splitDescription(meta?.description ?? '');
      const category = sentenceCase(meta?.title.split('/').slice(-2, -1)[0] ?? 'Other');
      return {
        name,
        category,
        description: prose,
        importLine,
        module: moduleName,
        props: propsFor(`${name}Props`).map((prop) => ({
          ...prop,
          defaultValue: defaults.get(prop.name),
        })),
      };
    });

  return components.sort((first, second) => first.name.localeCompare(second.name));
};
