var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "8652812aK14",
    database: "bamazon"


});

products();

function products() {


    connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });



    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log("Product ID: " + results[i].item_id);
            console.log("Product: " + results[i].product_name);
            console.log("Price:" + "$" + results[i].price);
            console.log("--------------------------------");
        }

        inquirer.prompt([
            {
                name: "items",
                type: "rawlist",
                message: "Which item_id would you like to buy?",
                choices: function () {
                    choiceArr = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArr.push(results[i].item_id);
                    }

                    return choiceArr;

                },


            },
            {
                name: "Amount",
                type: "input",
                message: "How many would you like to buy?"
            }
        ]).then(function (answer) {
            var itemChoice = answer.items;
            var amountChoice = answer.Amount;

            connection.query("SELECT stock_quantity FROM products WHERE item_id = " + itemChoice, function (err, results) {
                if (err) throw err;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].stock_quantity >= amountChoice) {
                        console.log("Here is your total!");
                        var newQuantity = results[i].stock_quantity - amountChoice;
                        connection.query('UPDATE products SET stock_quantity = ' + newQuantity + ' WHERE item_id = ' + itemChoice);
                        connection.query("SELECT price FROM products WHERE item_id = " + itemChoice, function (err, results) {
                            console.log("Your total is: $ " + results[0].price * amountChoice);
                            connection.end();
                        })
                    } else {
                        console.log("Oops, you can't do that sorry!");
                        connection.end();
                    }
                }
            })
        })

    });
};