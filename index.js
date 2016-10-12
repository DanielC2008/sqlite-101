'use strict'

const { Database } = require('sqlite3').verbose()
const db = new Database('db/Chinook_Sqlite.sqlite')
const Table = require('cli-table')


let table = new Table({
    head: [`Name`, 'Customer Id', 'Invoice Date', 'BillingCountry']
  , colWidths: [20, 20, 20, 20]
});

let table2 = new Table({
    head: [`Name`, 'Title'],
    colWidths: [20, 30]
});

db.serialize( () => {
	// Provide a query showing Customers (just their full names, customer ID and country) who are not in the US.
	db.all(`SELECT FirstName || ' ' || LastName AS Name,
								 CustomerId,
								 Country
					FROM 	 Customer
					WHERE  Country != 'USA'
					`, (err, customers) =>{
						console.log(customers)
					})
})

db.serialize( () => {
	//Provide a query only showing the Customers from Brazil.
	db.all(`SELECT FirstName || ' ' || LastName AS Name,
								 CustomerId,
								 Country
					FROM 	 Customer
					WHERE  Country = 'Brazil'
					`, (err, customers) =>{
						customers.map(({CustomerId, Name, Country}) => {
							console.log(`${CustomerId}: ${Name} (${Country})`)
						})
					})
})

db.serialize( () => {
	//Provide a query only showing the Customers from Brazil.
	db.each(`SELECT FirstName || " " || LastName AS "Name",
								 InvoiceId,
								 InvoiceDate,
								 BillingCountry
					FROM Invoice
					JOIN Customer ON Invoice.CustomerId = Customer.CustomerId
					WHERE Country = "Brazil" `, (err, { Name, InvoiceId, InvoiceDate, BillingCountry}) => {
						table.push([ Name, InvoiceId, InvoiceDate, BillingCountry])
					}, () => console.log(table.toString()) )
})

db.serialize( () => {
	//Provide a query showing only the Employees who are Sales Agents.
	db.each(`SELECT Employee.FirstName || ' ' || Employee.LastName AS 'Name', Title FROM Employee
						WHERE Title = 'Sales Support Agent'`, (err, {Name, Title}) => {
						table2.push([Name, Title])
					}, () => console.log(table2.toString()) )
})




db.close()
