class CreateQuotes < ActiveRecord::Migration[6.0]
  def change
    create_table :quotes do |t|
      t.jsonb :data

      t.timestamps
    end
  end
end
