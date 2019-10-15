const MariaLib = require("../lib/mariadb");
const bcrypt = require("bcrypt");
const debug = require("debug")("app:services:users");
const Boom = require("@hapi/boom");

class UsersServices {
  constructor() {
    this.table = "users";
    this.mariadb = new MariaLib();
  }
  /**Register user and after that check if is created
   * @param {*} name the name of the user
   * @param {*} lastname the lastname of the user
   * @param {*} password the passoword of the user
   * @param {*} email the email of the user
   */
  async signUp({name, lastname, password, email}) {
    //encrypt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //return promise that after create the user return it
    return this.mariadb
      .create(this.table, "(email, name, lastname, password)", [
        email,
        name,
        lastname,
        hashedPassword
      ])
      .then(({insertId}) =>
        this.mariadb.read(
          this.table,
          `WHERE user_id = '${insertId}'`,
          "email, password"
        )
      );
  }
  /**
   * Update a user
   */
  // prettier-ignore
  async updateUser({ userId, name, lastname, bio, profilePic, job }) {
    const setValues = `name='${name}', lastname='${lastname}',
                     biography='${bio}', profile_pic_url='${profilePic}',
                     job_title='${job}'`;
    return this.getByID({userId}).then(user => {
      if (!user) throw Boom.notFound(); 
      return this.mariadb
        .update(this.table, setValues, `user_id=${userId}`)
        .then(() => this.getByID({ userId }))
        .then(updatedUser => {
          debug(updatedUser)
          return updatedUser
        });
    });
  }

  /**Gets a user by his id.
   *  Return the first user finded with the provided id,
   * anyway it should only be one user with the id
   * @returns Promise with the user data
   */
  getByID({userId}) {
    return this.mariadb
      .read(
        this.table,
        `WHERE user_id = ${userId}`,
        "name, lastname, email, user_id, profile_pic_url, biography, job_title"
      )
      .then(users => ({
        id: users[0].user_id,
        name: users[0].name,
        lastname: users[0].lastname,
        profilePic: users[0].profile_pic_url,
        bio: users[0].biography,
        job: users[0].job_title
      }));
  }
  /**Gets a user by his email.
   * Return the first user finded with the provided email,
   * anyway it should only be one user with the email
   * @returns Promise with the user data
   */
  getByEmail({email}) {
    return this.mariadb
      .read(this.table, `WHERE email = '${email}'`)
      .then(users => users[0]);
  }
}
module.exports = UsersServices;
