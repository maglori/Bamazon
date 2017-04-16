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
});

var viewProducts = function () {
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
       
	});
};

var viewLow = function() {
		connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function(err, results){
        if (err) throw err;
        for (var i = 0; i < results.length; i++){
            console.log("Product ID: " + JSON.stringify(results[i]["item_id"]));
            console.log("Product Name: " + JSON.stringify(results[i]["product_name"]));
            console.log("Department Name: " + JSON.stringify(results[i]["department_name"]));
            console.log("Price: $" + JSON.stringify(results[i]["price"]));
            console.log("Amount in Stock: " + JSON.stringify(results[i]["stock_quantity"]));
            console.log("~~~~~~~~~~~~~~~~~");
        };//end of inventory display loop.
	});
};

var addInventory = function() {
	viewProducts();
	inquirer.prompt([
		{
			name: "ID",
			message: "What is the ID number of the product you like to add to?"
		},
		{
			name: "Amount",
			message: "How many would you like to add to your inventory?"
		}
	]).then(function(answers) {
		var Amount = parseInt(answers["Amount"]);
		var Product = answers["ID"];
		if (Product > 10 || Product < 1 || Product.length > 2) {
                console.log("Sorry! The product with an ID of " + answers["ID"] + " doesn't exist in our inventory.")
                setTimeout(addInventory, 1500);
        } else if (Amount === 0) {
                console.log("You tried to add 0 for some reason... Let's try again!")
                setTimeout(addInventory, 1500);

        } else {
			connection.query("UPDATE products SET stock_quantity = ? WHERE ?? = ?", [Amount, "item_id", Product], function(err, results) {
					setTimeout(bamazon, 1500);
					console.log("You've successfully updated your inventory!")
	        });
    	}
	});

};

// var addNew = function() {
// 	inquirer.prompt([
// 	{

// 	}
// 	]).then(function(answers){

// 	});
// };

console.log("Welcome to Bamazon!")

var bamazon = function() {

	inquirer.prompt([
		{
			name: "manager-options",
			message: "What would you like to do?",
			choices: ["View Products for Sale",
					  "View Low Inventory",
					  "Add to Inventory",
					  "Add New Product"
					 ],
			type: "list"
		}
	]).then(function(answers) {
		switch (answers["manager-options"]) {
			case "View Products for Sale":
				viewProducts();
				setTimeout(bamazon, 1500);
				break;
			case "View Low Inventory":
				viewLow();
				setTimeout(bamazon, 1500);
				break;
			case "Add to Inventory":
				addInventory();
				break;
			// case "Add New Product":
			// 	break;
		};
	});
}

bamazon();