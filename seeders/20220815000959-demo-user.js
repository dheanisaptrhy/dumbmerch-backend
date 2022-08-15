'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@mail.com",
          password:
            "$2b$10$KJp3xdTDlSbkin.C8Fw3k.tNjaky.3krXH8j.qylGdj1AB3Y57.Xm", //123456
          name: "admin",
          status: "admin",
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
