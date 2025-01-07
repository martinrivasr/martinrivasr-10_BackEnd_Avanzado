import amqp from 'amqplib';
import sharp from 'sharp';
import fs from 'fs';

async function startWorker() {
    try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
  
     //configuramos las entradas de donde queremos que el qorker escuche los mensajes
      const queues = ['imageQueue', 'testQueue1'];
  
      for (const queue of queues) {
        await channel.assertQueue(queue, { durable: true });
  
        console.log(`Esperando mensajes en la cola: ${queue}`);
  
        channel.consume(queue, async (msg) => {
          if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            console.log(`Procesando mensaje de ${queue}:`, content);
  
            // Simulación de procesamiento para la cola testQueue
            if (queue === 'testQueue1') {
              console.log(`Mensaje de prueba procesado:`, content);
              channel.ack(msg);
              return;
            }
  
            // Procesamiento para la cola imageQueue
            const { filePath, fileName } = content;
  
            try {
              const thumbnailPath = `./public/uploads/thumbnails/${fileName}`;
              fs.mkdirSync('./public/uploads/thumbnails', { recursive: true });
  
              await sharp(filePath)
                .resize(100, 100)
                .toFile(thumbnailPath);
  
              console.log(`Thumbnail generado en: ${thumbnailPath}`);
              channel.ack(msg);
            } catch (error) {
              console.error('Error procesando imagen:', error);
              channel.nack(msg, false, true);
            }
          }
        });
      }
    } catch (err) {
      console.error('Error al procesar mensajes:', err);
    }
  }
  
  startWorker();
  