package Serveur;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import Common.Message;
import Common.Reply;
import Common.Request;

public class TennisTournamentServer {

	private DatagramSocket mySocket;
	private ExecutorService cachedPool;
	
	public DatagramSocket getMySocket() {
		return mySocket;
	}
	
	public void startServer() {
		mySocket = null;
		
		// Obtain a cached thread pool
        cachedPool = Executors.newCachedThreadPool();
		
		try {
			
			mySocket = new DatagramSocket(6789); // port convenu avec les
													// clients
			byte[] buffer = new byte[1000];

			while (true) {
				DatagramPacket datagram = new DatagramPacket(buffer,
						buffer.length);
				mySocket.receive(datagram); // r�ception bloquante

				Message message = Message.unmarshall(datagram);
				if (message.isRequest()) {
					cachedPool.execute(new RequestHandler((Request)message, this));
					//new Thread(new RequestHandler((Request)message, this)).start();					
				} else {
					cachedPool.execute(new ReplyHandler((Reply) message, this));
					//new Thread(new ReplyHandler((Reply) message, this)).start();
				}
			}
		} catch (SocketException e) {
			System.out.println("Socket: " + e.getMessage());
		} catch (IOException e) {
			System.out.println("IO: " + e.getMessage());
		}

		finally {
			if (mySocket != null){
				mySocket.close();
				cachedPool.shutdown(); // shutdown the pool.
			}
		}

	}

	public void stopServer() {
		if (mySocket != null){
			mySocket.close();
		}
		cachedPool.shutdown(); // shutdown the pool.
	}
}
