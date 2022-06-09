const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './dbase.sqlite',
    sync: true, 
});

const employee_prop = {
    Staff_ID: DataTypes.STRING,
    Employee_Name: DataTypes.STRING,     
    Employee_Status: DataTypes.STRING,
    Hire_Date: DataTypes.STRING,
    Date_Of_Birth: DataTypes.STRING,
    Marital_Status: DataTypes.STRING,
    Gender: DataTypes.STRING,
    State_Of_Origin: DataTypes.STRING,
    Email_Address: DataTypes.STRING,
    Rank: DataTypes.STRING,
    Organization: DataTypes.STRING,   
    MDA: DataTypes.STRING,
    Grade: DataTypes.STRING,
    Step: DataTypes.INTEGER,
    Residence_Address: DataTypes.STRING,
    Contact_Address: DataTypes.STRING,
    Telephone_Number: DataTypes.STRING,
    Nationality: DataTypes.STRING,
    Bank_Name: DataTypes.STRING,       
    Account_Number: DataTypes.INTEGER,
    Legacy_Id: DataTypes.STRING,
    Net_Pay: DataTypes.INTEGER
}

const employeClass = sequelize.define('Employee', employee_prop, {freezeTableName: true})

async function db() {

    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });
        await employeClass.sync();
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

module.exports= {employeClass, sequelize, db}