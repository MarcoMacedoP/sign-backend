const MariaLib = require("../../lib/mariadb")
const debug = require("debug")("app:services:projects");


class Products  {

    constructor(){
        this.db = new MariaLib();
        this.table = "products"
    }


    async getProject ({projectId, userId}){
        const userType = await this.db.read("users", `user_id = ${userId}`, "( type )" );
        return new Promise((resolve, reject) =>{
            if (userType !== 2) reject("No tienes permiso para hacer esto.");
            else resolve (this.db.read(this.table, `project_id = ${projectId}`));
            }
        )
    }

     async createProject ({name, description, cutDate, initialCost, userId }) {
        const rows = "(name, description, cut_date, initial_cost)";
        const values = [name, description, cutDate, initialCost];
        const userType = await this.db.read("users", `WHERE user_id = ${userId}`, "(type)" );
        return new Promise((resolve, reject) =>{
            debug(userType )
            if (userType != 1) reject("No tienes permiso para hacer esto.");
            else resolve (this.db.create(this.table, rows, values ));
            }
        )
    }
    async updateProject({name, description, cutDate, initialCost, projectId, userId }){
        const set = `(name = ${name}, description = ${description}, cut_date = ${cutDate}, initial_cost = ${initialCost})`;
        const userType = await this.db.read("users", `user_id = ${userId}`, "( type )" );
        
        return new Promise((resolve, reject) =>{
            if (userType !== 1) reject("No tienes permiso para hacer esto.");
            else resolve (this.db.update(this.table, set, `WHERE project_id = ${projectId}`));
            }
        );
    }   

    async deleteProject ({projectId, userId}) {
        const set = "(active = 0)";
        const userType = await this.db.read("users", `user_id = ${userId}`, "( type )" );

        return new Promise((resolve, reject) =>{
            if (userType !== 3) reject("No tienes permiso para hacer esto.");
            else resolve (this.db.update(this.table, set, `WHERE project_id = ${projectId}`));
            }
        );
    }
}
module.exports = Products;