package TennisTournamentClient;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class TennisTournamentClient {

	private DatagramSocket mySocket;
	
	public DatagramSocket getMySocket() {
		return mySocket;
	}
	
	public void startClient() {
		mySocket = null;
		
		byte[] sendData = new byte[1024];
	    byte[] receiveData = new byte[1024];
		
		InetAddress IPAddress;
		try {
			IPAddress = InetAddress.getByName("localhost");
			
			DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, 6789);
			mySocket.send(sendPacket);
			
		    DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
		    mySocket.receive(receivePacket);
		    
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		finally {
			if (mySocket != null){
				mySocket.close();
			}
		}
		
		
	}
}
