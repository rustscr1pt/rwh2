const walk = require('estraverse');

/**
 * A function for cleaning and simplifying the inner contents of the return_biggest_array function
 * a1_0xaf9d
 * @param ast {AST} parsed Abstract Syntax Tree
 */
function clean_inner_part_of_return_biggest_array_function(ast) {
    walk.replace(ast, {
        enter : function (node) {
            // Step 1: Look for the reassignment of the function
            if (node.type === 'FunctionDeclaration') {
                let reassignmentFound = false;
                const body = node.body.body;

                // Check if body exists and is an array
                if (!Array.isArray(body)) return node;

                // Find the reassignment statement: a1_0xaf9d = function() {...}
                const reassignIndex = body.findIndex((stmt) =>
                    stmt.type === 'ExpressionStatement' &&
                    stmt.expression.type === 'AssignmentExpression' &&
                    stmt.expression.left.type === 'Identifier' &&
                    stmt.expression.left.name === node.id.name
                );

                if (reassignIndex !== -1) {
                    // Step 2: Remove the reassignment
                    body.splice(reassignIndex, 1);
                    reassignmentFound = true;
                }

                // Step 3: Modify the return statement to return a variable holding the array
                if (reassignmentFound) {
                    const returnStmt = body[body.length - 1];

                    // Replace the return statement with a variable holding the array
                    if (
                        returnStmt && // Check if returnStmt exists
                        returnStmt.type === 'ReturnStatement' &&
                        returnStmt.argument.type === 'CallExpression' &&
                        returnStmt.argument.callee.name === node.id.name
                    ) {
                        // Create a variable holding the array
                        const variableDeclaration = {
                            type: 'VariableDeclaration',
                            declarations: [{
                                type: 'VariableDeclarator',
                                id: {
                                    type: 'Identifier',
                                    name: '_0x44cecb' // Variable name
                                },
                                init: body[0].declarations[0].init // Array assignment
                            }],
                            kind: 'const'
                        };

                        // Modify the return statement to return the variable
                        returnStmt.argument = {
                            type: 'Identifier',
                            name: '_0x44cecb'
                        };
                    }
                }
            }
        }
    })
}


/**
 * A function for renaming functions in the AST
 * @param ast {AST} parsed Abstract Syntax Tree
 * @param oldName {string} old name of function which needs to be renamed
 * @param newName {string} new name for function
 */
function renameFunction(ast, oldName, newName) {
    walk.replace(ast, {
        enter : function (node) {
            if (
                (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') &&
                node.id &&
                node.id.name === oldName
            )
            {
                console.log(node);
                node.id.name = newName;
            }
            if (node.type === 'Identifier' && node.name === oldName) {
                node.name = newName;
            }
        }
    })
}

/**
 * A function for renaming constants in the AST
 * @param ast {AST} parsed Abstract Syntax Tree
 * @param oldName {string} old name of function which needs to be renamed
 * @param newName {string} new name for function
 */
function renameConst(ast, oldName, newName) {
    walk.replace(ast, {
        enter : function (node) {
            // Rename the const declaration
            if (node.type === 'VariableDeclarator' && node.id.name === oldName) {
                node.id.name = newName;
            }
            // Rename all references to the const
            if (node.type === 'Identifier' && node.name === oldName) {
                node.name = newName;
            }
        }
    })
}

/**
 * A function for removing IIFE from return_biggest_array function (START)
 * @param ast {AST} parsed Abstract Syntax Tree
 * @param oldName {string} old name of function which needs to be renamed
 * @param newName {string} new name for function
 */
function clean_return_biggest_array_from_IIFE(ast) {
    walk.replace(ast, {
        enter : function (node) {
            if (
                node.type === 'ExpressionStatement' &&
                node.expression.type === 'CallExpression' &&
                node.expression.callee.type === 'FunctionExpression'
            ) {
                this.remove()
            }
        }
    })
}

/**
 * A function for removing IIFE from return_biggest_array function (START)
 * @param ast {AST} parsed Abstract Syntax Tree
 * @param oldName {string} old name of function which needs to be renamed
 * @param newName {string} new name for function
 */
function remove_unused_pieces_after_big_array_function(ast) {
    walk.replace(ast, {
        enter : function (node) {
            if (
                node.type === 'VariableDeclaration' &&
                node.declarations.length > 0 &&
                node.declarations[0].id.name === 'a1_0x564f5d'
            ) {
                this.remove()
            }
            if (
                node.type === 'ExpressionStatement' &&
                node.expression &&
                node.expression.callee &&
                node.expression.callee.name &&
                node.expression.callee.name === 'a1_0x2fa651'
            ) {
                this.remove()
            }
        }
    })
}

/**
 * A function for removing const_a1_0xbb9841 not sure if it is used ???
 * @param ast {AST} parsed Abstract Syntax Tree
 */
function remove_unused_const_a1_0xbb9841(ast) {
    walk.replace(ast, {
        enter : function (node) {
            if (
                node.type === 'VariableDeclaration' &&
                node.declarations.length > 0 &&
                node.declarations[0].id.name === 'a1_0xbb9841'
            ) {
                this.remove()
            }
            if (
                node.type === 'ExpressionStatement' &&
                node.expression &&
                node.expression.callee &&
                node.expression.callee.name &&
                node.expression.callee.name === 'a1_0xbb9841'
            ) {
                this.remove()
            }
        }
    })
}

/**
 * A function for simplifying the const _0x50a6ee
 * @param ast {AST} parsed Abstract Syntax Tree
 */
function simplify_const_0x50a6ee(ast) {
    walk.replace(ast, {
        enter : function (node) {
            if (
                node.type === 'ExpressionStatement' &&
                node.expression &&
                node.expression.length > 1 &&
                node.expression.expressions

            ) {

            }
        }
    })
}

/**
 * Move a specific function out of the program flow by its name, avoiding cycles or repeated references.
 * @param ast {AST} parsed Abstract Syntax Tree
 * @param targetFunctionName {String} Name of the function to move
 */
function moveFunctionByNameOut(ast, targetFunctionName) {
    const functionDeclarations = [];
    const body = ast.body;
    const visited = new Set(); // Set to track visited nodes
    const movedFunctions = new Set(); // Set to track moved functions

    console.log('h'); // Log to verify when the function is being called

    // Use estraverse to walk through the AST and collect function declarations
    walk.replace(ast, {
        enter(node, parent) {
            // Check if the node has already been visited
            if (visited.has(node)) {
                return walk.VisitorOption.Skip; // Skip this node if it has already been visited
            }
            visited.add(node); // Mark this node as visited

            // Check for function declarations
            if (node.type === 'FunctionDeclaration' && node.id.name === targetFunctionName) {
                // Ensure that the function is not moved again
                if (!movedFunctions.has(node.id.name)) {
                    // Add the target function to the list of functionDeclarations
                    functionDeclarations.push(node);

                    // Remove the function from the body
                    const index = body.indexOf(node);
                    if (index > -1) {
                        body.splice(index, 1);
                    }

                    // Mark this function as moved
                    movedFunctions.add(node.id.name);
                }
            }
        }
    });

    // Move the target function declaration to the top of the program body
    ast.body = [...functionDeclarations, ...body];
}

const estraverse = require('estraverse');

// /**
//  * Move all function declarations out of the program flow.
//  * @param ast {AST} parsed Abstract Syntax Tree
//  */
// function moveFunctionsOut(ast) {
//     const functionDeclarations = [];
//     const body = ast.body;
//     const visited = new Set(); // Set to track visited nodes
//
//     console.log('Starting to move functions'); // Log to verify when the function is being called
//
//     // Use estraverse to walk through the AST and collect function declarations
//     estraverse.replace(ast, {
//         enter(node, parent) {
//             // Check if the node has already been visited
//             if (visited.has(node)) {
//                 return estraverse.VisitorOption.Skip; // Skip this node if it has already been visited
//             }
//             visited.add(node); // Mark this node as visited
//
//             // Check for function declarations and collect them
//             if (node.type === 'FunctionDeclaration') {
//                 functionDeclarations.push(node);
//
//                 // Remove the function from the body
//                 const index = body.indexOf(node);
//                 if (index > -1) {
//                     body.splice(index, 1);
//                 }
//             }
//         }
//     });
//
//     // Move all function declarations to the top of the program body
//     ast.body = [...functionDeclarations, ...body];
// }


// /**
//  * Move all function declarations out of the program flow, removing duplicates.
//  * @param ast {AST} parsed Abstract Syntax Tree
//  */
// function moveFunctionsOut(ast) {
//     const functionDeclarations = [];
//     const body = ast.body;
//     const visited = new Set(); // Set to track visited nodes
//     const functionNames = new Set(); // Set to track function names that have already been moved
//
//     console.log('Starting to move functions'); // Log to verify when the function is being called
//
//     // Use estraverse to walk through the AST and collect function declarations
//     walk.replace(ast, {
//         enter(node) {
//             // Check if the node has already been visited
//             if (visited.has(node)) {
//                 return walk.VisitorOption.Skip; // Skip this node if it has already been visited
//             }
//             visited.add(node); // Mark this node as visited
//
//             // Check for function declarations and collect them if not already moved
//             if (node.type === 'FunctionDeclaration') {
//                 if (!functionNames.has(node.id.name)) {
//                     functionDeclarations.push(node); // Add the function to the list
//                     functionNames.add(node.id.name); // Mark this function as moved
//
//                     // Remove the function from the body
//                     const index = body.indexOf(node);
//                     if (index > -1) {
//                         body.splice(index, 1);
//                     }
//                 } else {
//                     // If function name already moved, remove it
//                     const index = body.indexOf(node);
//                     if (index > -1) {
//                         body.splice(index, 1); // Remove duplicate function
//                     }
//                 }
//             }
//         }
//     });
//
//     // Move all function declarations to the top of the program body
//     ast.body = [...functionDeclarations, ...body];
// }

/**
 * Move all function declarations out of the program flow, removing duplicates found 10 layers deep.
 * @param ast {AST} parsed Abstract Syntax Tree
 */
function moveFunctionsOut(ast) {
    const functionDeclarations = [];
    const body = ast.body;
    const visited = new Set(); // Set to track visited nodes
    const functionNames = new Set(); // Set to track function names that have already been moved

    console.log('Starting to move functions'); // Log to verify when the function is being called

    // Use estraverse to walk through the AST and collect function declarations
    walk.replace(ast, {
        enter(node, parent) {
            // Check if the node has already been visited
            if (visited.has(node)) {
                return walk.VisitorOption.Skip; // Skip this node if it has already been visited
            }
            visited.add(node); // Mark this node as visited

            // Check if the node is a function declaration
            if (node.type === 'FunctionDeclaration') {
                // If the function is not already moved, add it
                if (!functionNames.has(node.id.name)) {
                    functionDeclarations.push(node);
                    functionNames.add(node.id.name); // Mark this function as already moved
                } else {
                    // If it's a duplicate function, check its depth
                    const depth = getDepth(node, parent);
                    if (depth > 100) {
                        // Remove the duplicate function from the body
                        const index = body.indexOf(node);
                        if (index > -1) {
                            body.splice(index, 1); // Remove duplicate function
                        }
                    }
                }

                // Remove the function from the body at its original position
                const index = body.indexOf(node);
                if (index > -1) {
                    body.splice(index, 1);
                }
            }
        }
    });

    // Move all function declarations to the top of the program body
    ast.body = [...functionDeclarations, ...body];
}

/**
 * Helper function to calculate the depth of a node in the AST
 * @param {Object} node - The current node
 * @param {Object} parent - The parent node of the current node
 * @returns {number} - The depth level of the node
 */
function getDepth(node, parent) {
    let depth = 0;
    while (parent) {
        depth++;
        parent = parent.parent; // Move up the parent chain
    }
    return depth;
}







//Simplified version. Check the dialog https://chatgpt.com/c/674f53ad-e1f8-8005-9360-d7f19e645111
// const isWorker = typeof WorkerGlobalScope !== 'undefined';
// const isValid = (() => {
//     try {
//         const num = (-231 * -25 + 3793 * 1 + -661 * -3); // This results in 804
//         num.toFixed(); // This will work without throwing an error
//         return true;
//     } catch (error) {
//         return false;
//     }
// })();
//
// const comparisonResult = 804 == isValid; // Checking if 804 equals isValid




/**
 * My wrapper for cleaning the obfuscated code using AST
 * @param ast {AST} parsed Abstract Syntax Tree
 */
function my_ast_wrapper(ast) {
    walk.replace(ast, {
        enter: function (node) {
            clean_inner_part_of_return_biggest_array_function(ast)
            renameFunction(ast, 'a1_0xaf9d', 'return_biggest_array');
            clean_return_biggest_array_from_IIFE(ast);
            //moveFunctionByNameOut(ast, '_0x57e3e7');
            moveFunctionsOut(ast);
            // remove_unused_pieces_after_big_array_function(ast);
            // remove_unused_const_a1_0xbb9841(ast);
            return node;
        }
    });
    return ast;
}

module.exports = my_ast_wrapper;
