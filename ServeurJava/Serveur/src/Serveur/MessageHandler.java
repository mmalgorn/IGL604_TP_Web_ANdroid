package Serveur;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;

import Common.*;

abstract public class MessageHandler implements Runnable {

	private Message message;
	private TennisTournamentServer myServer;

	public MessageHandler() {
		super();
	}

	public MessageHandler(Message message, TennisTournamentServer tennisTournamentServer) {
		this.message = message;
		this.myServer = tennisTournamentServer;
	}

	protected void transmettre(Message message) {
		DatagramSocket aSocket = null;
		try {
			aSocket = new DatagramSocket(6789); // port convenu avec les clients
			byte[] buffer = new byte[1000];

			while (true) {
				//DatagramPacket datagram = new DatagramPacket(message.getData(),
						//message.getLength(), 
						//message.getDestinationAsInet(),
						//message.getDestinationPort());
				//aSocket.send(datagram); // �mission non-bloquante
			}
		} catch (SocketException e) {
			System.out.println("Socket: " + e.getMessage());
		} catch (IOException e) {
			System.out.println("IO: " + e.getMessage());
		} finally {
			if (aSocket != null)
				aSocket.close();
		}
	}

	public Message getMessage() {
		return message;
	}

	public void setMessage(Message message) {
		this.message = message;
	}

	public TennisTournamentServer getMyServer() {
		return myServer;
	}

	public void setMyServer(TennisTournamentServer myServer) {
		this.myServer = myServer;
	}

}