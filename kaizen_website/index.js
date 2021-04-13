var apiQuery = "SELECT * FROM k_orders inner join k_orderproducts on k_orderproducts.orderid = k_orders.orderid inner join k_products on k_orderproducts.productid = k_products.productid inner join k_orderforms on k_orderforms.orderid = k_orders.orderid inner join k_forms on k_orderforms.formid = k_forms.formid";

// REQUIRED CODE----------------------------------------------------------
const express = require("express"); //returns an express function
const mysql = require('mysql');
const app = express();              //on object of type express
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));

//ROUTES------------------------------------------------------------------
//solely to ensure connection to db is working
app.get("/dbTest", async function(req, res){
    let sql = "SELECT CURDATE()";
    let rows = await executeSQL(sql);
    res.send(rows);
}); 

app.get('/', (req, res) => {
   // let sql = "select K_Orders.Order_No, k_orders.orderstatus, K_Products.productName, K_Customers.FirstName, k_customers.lastname, K_OrderProducts.Quantity, K_orders.startdate FROM K_Orders    inner join K_OrderProducts on K_Orders.OrderID = K_OrderProducts.OrderID inner join K_Products on K_OrderProducts.ProductID = K_Products.ProductID inner join K_Customers on K_Orders.CustomerID = K_Customers.CustomerID where K_Orders.Order_No = 70002";

    res.render("index");
});//root route

app.get('/searchForms', async (req, res) => {
    let sql = "SELECT * FROM K_Orders INNER JOIN K_OrderProducts on K_Orders.OrderID = K_OrderProducts.OrderID INNER JOIN K_Products on K_OrderProducts.ProductID = K_Products.ProductID INNER JOIN K_Customers on K_Orders.CustomerID = K_Customers.CustomerID";

    let statuses = "SELECT DISTINCT orderstatus FROM k_orders ";
    let forms = "SELECT * FROM k_forms";
    
    let rows = await executeSQL(sql);
    let statusRows = await executeSQL(statuses);
    let formRows = await executeSQL(forms);

    res.render("searchForms", {"results": rows, "status": statusRows, "forms": formRows});
});//search forms


app.get('/searchByStatus', async (req, res) => {
    let status = req.query.status;
    console.log(status);
  
    let sql = `${apiQuery} WHERE orderstatus = '${status}'`;
    let rows = await executeSQL(sql);
    console.log(rows);

    res.render("searchForms", {"results": rows});
});


app.get('/api/getInfo', async (req, res) => {
    let sql = apiQuery;

    let rows = await executeSQL(sql);
    res.send(rows);
});//api/getInfo

//FUNCTIONS---------------------------------------------------------------
//executes query in sql---
async function executeSQL(sql, params){
    return new Promise (function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
        if (err) throw err;
        resolve(rows);
        });
    });
}

//connects to database---
function dbConnection(){
   const pool  = mysql.createPool({
        connectionLimit: 10,
        host: "eyw6324oty5fsovx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "ivnp04psn830v8r3",
        password: "qdkhyvgv5945v04k",
        database: "j8aa09oi3eky1hle"
   }); 
   return pool;
}

//starts server---
app.listen(3000, () =>
console.log(`Expresss server running...`));
