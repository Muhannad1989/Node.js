'use strict';

const fs = require('fs');

const ENCODING = 'utf8';

class Actions {
  constructor(filename) {
    this._filename = filename;
  }

  list() {
    return new Promise((resolve, reject) => {
      fs.readFile(this._filename, ENCODING, (err, todoList) => {
        if (err) {
          if (err.code === 'ENOENT') console.log('no data found');
          return reject(err);
        }
        resolve(todoList);
      });
    });
  }
  reset(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this._filename, JSON.stringify(data), err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  async update(request, response, value) {
    try {
      let read = await this.list();
      read = JSON.parse(read);
      const index = parseInt(request.params.id);
      if (index > 0 && index <= read.length) {
        read[index - 1].done = value;
        await this.reset(read);
        response.status(201).send({ succeeded: 'data has been modified' });
      } else {
        response.status(404).send({ filed: 'invalid id number' });
      }
    } catch {
      response.status(404).send({ error: 'there is an error' });
    }
  }
}

module.exports = Actions;
