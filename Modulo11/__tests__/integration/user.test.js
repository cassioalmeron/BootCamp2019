import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import User from '../../src/app/models/User';
import truncate from '../util/truncate';
import factory from '../factories';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    // const user = await User.create({
    //   name: 'Cassio Almeron',
    //   email: 'cassio@ciasistemas.com.br',
    //   password: '123456',
    // });

    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);
    // .send({
    //   name: 'Cassio Almeron',
    //   email: 'cassio@ciasistemas.com.br',
    //   password: '123456',
    // });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User', {
      email: 'cassio@ciasistemas.com.br',
    });
    await request(app)
      .post('/users')
      .send(user);
    // .send({
    //   name: 'Cassio Almeron',
    //   email: 'cassio@ciasistemas.com.br',
    //   password: '123456',
    // });

    const response = await request(app)
      .post('/users')
      .send(user);
    // .send({
    //   name: 'Cassio Almeron',
    //   email: 'cassio@ciasistemas.com.br',
    //   password: '123456',
    // });

    // console.log(response);
    expect(response.status).toBe(400);
  });
});
