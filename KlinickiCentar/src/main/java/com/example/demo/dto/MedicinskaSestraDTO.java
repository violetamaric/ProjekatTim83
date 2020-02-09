package com.example.demo.dto;

import com.example.demo.model.MedicinskaSestra;

public class MedicinskaSestraDTO{

	private Long id;
	private String ime;
	private String prezime;
	private String email;
	private String brTelefona;
	private String lozinka;
	//0-mora da promeni lozinku pri prvom logovanju
	//1-moze da se loguje lagano 
	//2-izbrisan 
	private int status; 
	
	
	
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getLozinka() {
		return lozinka;
	}
	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getIme() {
		return ime;
	}
	public void setIme(String ime) {
		this.ime = ime;
	}
	public String getPrezime() {
		return prezime;
	}
	public void setPrezime(String prezime) {
		this.prezime = prezime;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getBrTelefona() {
		return brTelefona;
	}
	public void setBrTelefona(String brTelefona) {
		this.brTelefona = brTelefona;
	}
//	public MedicinskaSestraDTO(Long id, String ime, String prezime, 
//			String email,String lozinka, String brTelefona, int status) {
//		super();
//		this.id = id;
//		this.ime = ime;
//		this.prezime = prezime;
//		this.email = email;
//		this.lozinka = lozinka;
//		this.brTelefona = brTelefona;
//		this.status = status;
//
//	}
	public MedicinskaSestraDTO() {
		super();
	}
	public MedicinskaSestraDTO(MedicinskaSestra ms) {
		super();
		this.id = ms.getId();
		this.ime = ms.getIme();
		this.prezime = ms.getPrezime();
		this.email = ms.getEmail();
		this.lozinka = ms.getLozinka();
		this.brTelefona = ms.getBrTelefona();
		this.status = ms.getStatus();

	}
	
	
	
}
