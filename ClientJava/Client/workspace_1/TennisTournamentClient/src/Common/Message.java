package Common;

import java.io.Serializable;
import java.net.DatagramPacket;
import java.net.InetAddress;

public class Message implements Serializable {

	
	public static Message unmarshall(DatagramPacket datagram) {
		// TODO Auto-generated method stub
		return null;
	}
	
	final static public int REQUEST = 0;
	final static public int REPLY = 1;
	
	private int type;					// type de message request or reply
	private int numero; 				// num�ro de la requ�te originelle  

	private String  destination; 		// destinataire du message
	private int destinationPort;					// port du destinataire

	private String  sender; 			// �metteur du message
	private int senderPort;				// port de l'�metteur du message

	private Object value;				// dans le cas d'une requ�te, le nom symbolique dont on recherche l'adresse IP
										// dans le cas d'une r�ponse, l'adresse IP correspondant au nom symbolique
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getNumero() {
		return numero;
	}
	public void setNumero(int numero) {
		this.numero = numero;
	}
	public String getDestination() {
		return destination;
	}
	public void setDestination(String sender) {
		this.destination = sender;
	}
	public int getDestinationPort() {
		return destinationPort;
	}
	public void setDestinationPort(int port) {
		this.destinationPort = port;
	}
	public Object getValue() {
		return value;
	}
	public void setValue(Object value) {
		this.value = value;
	}
	
	public byte[] getData() {		
		return Marshallizer.marshallize(this);
	}
	public int getLength() {
		return Marshallizer.marshallize(this).length;
	}
	public boolean isRequest() {
		return type == REQUEST;
	}
	public InetAddress getDestinationAsInet() {
		// TODO Auto-generated method stub
		return null;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public int getSenderPort() {
		return senderPort;
	}
	public void setSenderPort(int senderPort) {
		this.senderPort = senderPort;
	}

}
