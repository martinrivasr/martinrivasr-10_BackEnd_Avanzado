import amqp from 'amqplib';

let connection;
let channel;

/**
 * Conectar a RabbitMQ y crear un canal.
 */
export async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost'); // Cambia la URL si usas Docker u otra configuración.
    channel = await connection.createChannel();
    console.log('Conectado a RabbitMQ');
  } catch (err) {
    console.error('Error al conectar con RabbitMQ:', err);
    throw err;
  }
}

/**
 * Enviar un mensaje a la cola.
 * @param {string} queue - Nombre de la cola.
 * @param {Object} message - Mensaje a enviar.
 */
export async function sendToQueue(queue, message) {
  try {
    if (!channel) {
      throw new Error('El canal no está inicializado. Llama primero a connectToRabbitMQ().');
    }
    await channel.assertQueue(queue, { durable: true }); // Asegurar que la cola existe.
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))); // Enviar el mensaje.
    console.log(`Mensaje enviado a la cola ${queue}:`, message);
  } catch (err) {
    console.error('Error al enviar mensaje a RabbitMQ:', err);
    throw err;
  }
}
