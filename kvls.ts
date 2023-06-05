import Table from 'npm:cli-table3'

const kv = await Deno.openKv()
const opt = Deno.args[0]

const users = await kv.list({prefix: [opt]})
const rows = []

for await (const {key, value} of users) {
  rows.push([key[1].toString(), JSON.stringify(value)])
}


var table = new Table({
    head: ['key', 'value']
  , colWidths: [32, 64]
});
table.push(
  ...rows
);

console.log(table.toString());