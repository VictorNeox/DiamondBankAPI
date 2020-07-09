
exports.up = function(knex) {
    return knex.schema.createTable('transactions', (table) => {
        table.increments().primary();
        table.decimal('value').defaultTo(0);
        table.string('receiver').notNullable();
        table.integer('accountid').notNullable();
        
        table.foreign('accountid').references('bankaccount').inTable('users');
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('transactions');
  };
  