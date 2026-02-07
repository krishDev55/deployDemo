package com.deployDemo.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Arrays;

import com.github.sarxos.webcam.Webcam;
import com.github.sarxos.webcam.ds.ipcam.IpCamMode;
import com.google.zxing.*;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.github.sarxos.webcam.ds.ipcam.*;

import java.awt.image.BufferedImage;

//@Service
public class WebScannerQR { 
	 
     public WebScannerQR() throws MalformedURLException {
    	 Webcam.setDriver(new IpCamDriver());
		 IpCamDeviceRegistry.register("MobileCam", "http://192.168.1.4:8080/video", IpCamMode.PUSH);
     }

		public String scanQrCode() throws MalformedURLException, InterruptedException {
//			 Webcam webcam = Webcam.getDefault();
			 
			
			 Webcam webcam = Webcam.getWebcamByName("MobileCam");
			 
			 
		        if (webcam == null) {  
		            System.out.println("❌ No webcam detected!");
		            return "No Camera";
		        }

		        webcam.open();
		        System.out.println("📷 Webcam opened. Scanning for QR codes...");
		        Result result=null;
		        while (true) {
		            BufferedImage image = webcam.getImage();
		            if (image == null) continue;

		            LuminanceSource source = new BufferedImageLuminanceSource(image);
		            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

		            try {
		                result = new MultiFormatReader().decode(bitmap);
		                System.out.println("✅ QR Code detected: " + result);
		                break; // stop after detecting one code
		            } catch (NotFoundException e) {
		                // no QR code in this frame, keep scanning
		            }

		            Thread.sleep(1000);
		        }
 
		        webcam.close();
		        System.out.println("📴 Scanner closed.");
		        return result.getText();	
		       
		        
		}
}
