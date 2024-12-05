// Импорт необходимых модулей
const esprima = require('esprima');
const fs = require('fs');
const walk = require('estraverse');
const escodegen = require('escodegen');

// Чтение обфусцированного кода из файла
const obfuscated = fs.readFileSync('test.js', "utf-8");
// Разбор кода в AST (Abstract Syntax Tree)
const ast = esprima.parseScript(obfuscated);

// Объекты для хранения констант и массивов
const constants = {};
const arrays = {};

/**
 * Удаляет выражения самоприсвоения (например, `a = a`).
 * @param {Object} node - Узел AST.
 */
function handleSelfAssignment(node) {
    if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
        if (node.expression.left.name === node.expression.right.name) {
            this.remove();
        }
    }
}

/**
 * Преобразует логические выражения (`&&`, `||`) в условные выражения.
 * @param {Object} node - Узел AST.
 */
function handleLogicalExpressions(node) {
    if (node.operator === '&&') {
        node.type = 'ConditionalExpression';
        node.test = node.left;
        node.consequent = node.right;
        node.alternate = { type: 'Literal', value: false };
    } else if (node.operator === '||') {
        node.type = 'ConditionalExpression';
        node.test = node.left;
        node.consequent = { type: 'Literal', value: true };
        node.alternate = node.right;
    }
}

/**
 * Упрощает условные выражения на основе их тестовых условий.
 * @param {Object} node - Узел AST.
 * @returns {Object} - Упрощённый узел.
 */
function handleIfStatements(node) {
    if (node.test.type === 'Literal') {
        return node.test.value ? node.consequent : (node.alternate || { type: 'EmptyStatement' });
    }
}

/**
 * Сохраняет значения литералов из деклараций переменных в объект `constants`.
 * @param {Object} node - Узел AST.
 */
function handleVariableDeclarators(node) {
    if (node.type === 'VariableDeclarator' && node.init?.type === 'Literal') {
        constants[node.id.name] = node.init.value;
    }
}

/**
 * Заменяет идентификаторы их значениями из объекта `constants`.
 * @param {Object} node - Узел AST.
 * @returns {Object} - Литерал с заменённым значением.
 */
function replaceIdentifiersWithConstants(node) {
    if (node.type === 'Identifier' && constants[node.name] !== undefined) {
        return { type: 'Literal', value: constants[node.name] };
    }
}

/**
 * Упрощает строковые сложения, если оба операнда являются литералами.
 * @param {Object} node - Узел AST.
 */
function simplifyBinaryExpressions(node) {
    if (node.type === 'BinaryExpression' && node.operator === '+') {
        if (node.left.type === 'Literal' && node.right.type === 'Literal') {
            node.type = 'Literal';
            node.value = node.left.value + node.right.value;
            delete node.left;
            delete node.right;
            delete node.operator;
        }
    }
}

/**
 * Инлайнит вызовы `setTimeout` с нулевой задержкой.
 * @param {Object} node - Узел AST.
 * @returns {Object} - Тело функции из `setTimeout`.
 */
function inlineSetTimeout(node) {
    if (node.type === 'CallExpression' &&
        node.callee.name === 'setTimeout' &&
        node.arguments[0].type === 'FunctionExpression' &&
        node.arguments[1].value === 0) {
        return node.arguments[0].body;
    }
}

// Проход по AST и трансформация узлов
walk.traverse(ast, {
    enter: function (node) {
        // Обработка литералов в декларациях переменных
        if (node.type === 'VariableDeclarator' && node.init?.type === 'Literal') {
            constants[node.id.name] = node.init.value;
        }

        // Замена идентификаторов константами
        if (node.type === 'Identifier' && constants[node.name] !== undefined) {
            return { type: 'Literal', value: constants[node.name] };
        }

        // Упрощение строковых сложений
        simplifyBinaryExpressions(node);

        // Инлайн вызовов `setTimeout`
        if (node.type === 'CallExpression' &&
            node.callee.name === 'setTimeout' &&
            node.arguments[0].type === 'FunctionExpression' &&
            node.arguments[1].value === 0) {
            return node.arguments[0].body;
        }

        // Преобразование логических выражений
        if (node.type === 'LogicalExpression') {
            handleLogicalExpressions(node);
        }

        // Удаление самоприсвоений
        handleSelfAssignment(node);

        // Упрощение условных выражений
        if (node.type === 'IfStatement' || node.type === 'ConditionalExpression') {
            return handleIfStatements(node);
        }

        // Сохранение массивов
        if (node.type === 'VariableDeclarator' && node.init?.type === 'ArrayExpression') {
            arrays[node.id.name] = node.init.elements.map(el => el.value);
        }

        // Замена обращений к массивам
        if (node.type === 'MemberExpression' &&
            node.property.type === 'Literal' &&
            node.object.type === 'Identifier') {
            const index = node.property.value;
            if (Array.isArray(arrays[node.object.name])) {
                return { type: 'Literal', value: arrays[node.object.name][index] };
            }
        }
    },
});

// Генерация кода из AST
const deobfuscatedCode = escodegen.generate(ast);
const compactCode = escodegen.generate(ast, {
    format: {
        indent: { style: '' },
        quotes: 'single',
        compact: true,
    }
});

// Удаление старых файлов
['compactdeobfuscated.js', 'deobfuscated.js'].forEach((file) => {
    fs.rmSync(`./cleaned/${file}`, { force: true });
});

// Запись результатов в файлы
fs.writeFileSync('./cleaned/compactdeobfuscated.js', compactCode, 'utf8');
fs.writeFileSync('./cleaned/deobfuscated.js', deobfuscatedCode, 'utf8');

// Запись AST в JSON
fs.writeFileSync('output-new.json', JSON.stringify(ast, null, 2), 'utf-8');
