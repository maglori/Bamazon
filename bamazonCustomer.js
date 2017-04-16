var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId);
});

console.log("Welcome to Bamazon!")

var bamazon = function() {

    connection.query('SELECT * FROM products', function(err, results){
        if (err) throw err;
        for (var i = 0; i < results.length; i++){
            console.log("Product ID: " + JSON.stringify(results[i]["item_id"]));
            console.log("Product Name: " + JSON.stringify(results[i]["product_name"]));
            console.log("Department Name: " + JSON.stringify(results[i]["department_name"]));
            console.log("Price: $" + JSON.stringify(results[i]["price"]));
            console.log("Amount in Stock: " + JSON.stringify(results[i]["stock_quantity"]));
            console.log("~~~~~~~~~~~~~~~~~");
        };//end of inventory display loop.

        inquirer.prompt([
            {
                name: "ID",
                message: "What is the ID number of the product you wish to buy?"
            },
            {
                name: "Amount",
                message: "How many of this product would you like to purchase?"
            }
        ]).then(function(answers) {
            //if the user choses an item not in our inventory, the app will restart
            if (answers["ID"] > 10 || answers["ID"] < 1) {
                console.log("Sorry! The product with an ID of " + answers["ID"] + " doesn't exist in our inventory. We'll restart the app for you in just a second.")
                setTimeout(bamazon, 2000);
            //if the user accidentaly attempts to buy 0 of an item, the app will restart
            } else if (answers["Amount"] == 0) {
                console.log("You can't buy 0 of something... We'll restart the app for you in just a second.")
                setTimeout(bamazon, 2000);

            } else {
            // if the user's input checks out, we'll get query the item in question.
                connection.query('SELECT * FROM products WHERE item_id = ?', [answers["ID"]], function(err, results){
                    if (err) throw err;
                    //I saved the values we'd be using more than once in variables.
                        var Amount = results[0]["stock_quantity"];
                        var Product = results[0]["product_name"];
                        var Price = results[0]["price"];
                    //Some calculations we'll need later, based on those values we just saved.
                        var newAmount = Amount - answers["Amount"];
                        var Cost = Price * answers["Amount"]
                    //All the info for the product the user wants to buy.
                        console.log("Product ID: " + JSON.stringify(results[0]["item_id"]));
                        console.log("Product Name: " + JSON.stringify(Product));
                        console.log("Department Name: " + JSON.stringify(results[0]["department_name"]));
                        console.log("Price: $" + JSON.stringify(Price));
                        console.log("Amount in Stock: " + JSON.stringify(Amount));
                        console.log("~~~~~~~~~~~~~~~~~");
                    //If we have less in stock than they ask for...
                    if (Amount < answers["Amount"]) {
                        if (results[0]["item_id"] === 1) console.log("There are only 2 of those in existence...!")
                        //They can't buy it, so it will restart.
                        //AND if they want to buy more than two of the Blue eyes white dragon, they'll get a special message...
                        console.log("Sorry, we don't have enough of that item to complete your purchase. We'll restart the app for you in just a second.")
                        setTimeout(bamazon, 2000)
                    } else {
                        //Otherwise the purchase goes through, we update our DB and tell the user what they paid.
                        console.log("You paid a total of $" + Cost + ". Press control C to exit the app!")
                        connection.query("UPDATE products SET stock_quantity = ? WHERE ?? = ?", [newAmount, "product_name", Product], function(err, results) {
                            //console.log(results);
                        });
                    }//end of nested conditional
                });//end of query for user's desired product.
            }//end of main conditional, based on user's desired product and amount desired.
        });//end of main inquirer prompt
    });//end of full inventory query: our main query.

}; //end of bamazon.

bamazon();