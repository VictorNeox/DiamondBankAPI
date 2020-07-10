
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.increments('bankaccount').primary();
        table.decimal('value').defaultTo(2000);
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  