package com.example.demo.dto;

import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.Lekar;


public class LekarDTO {

	private Long id;

	private String ime;

	private String prezime;

	private String lozinka;

	private String email;
	
	private String telefon;
	
	private Long klinikaID;
	
	private int ocena;
	//0-mora da promeni lozinku pri prvom logovanju
	//1-moze da se loguje lagano 
	//2-izbrisan 
	private int status; 
	

	public LekarDTO() {
		super();
	}

	public LekarDTO(Long id, String ime, String prezime, String lozinka,
			Long klinikaID, String email, String telefon, int ocena, int status) {
		super();
		this.id = id;
		this.ime = ime;
		this.prezime = prezime;
		this.lozinka = lozinka;
		this.email = email;
		this.telefon=telefon;
		this.klinikaID = klinikaID;
		this.ocena = ocena;
		this.status = status;
	}
	
	public LekarDTO(Lekar lekar) {
		super();
		// TODO Auto-generated constructor stub
		this.id = lekar.getId();
		this.ime = lekar.getIme();
		this.prezime = lekar.getPrezime();
		this.lozinka = lekar.getLozinka();
		this.email = lekar.getEmail();
		if(lekar.getKlinika() != null) {
			this.klinikaID = lekar.getKlinika().getId();
		}
		
		this.telefon = lekar.getTelefon();
		this.ocena = lekar.getOcena();
		this.status = lekar.getStatus();
	}

	
	
	@Override
	public String toString() {
		return "LekarDTO [id=" + id + ", ime=" + ime + ", prezime=" + prezime + ", lozinka=" + lozinka + ", email="
				+ email + ", telefon=" + telefon + ", klinikaID=" + klinikaID + ", ocena=" + ocena + "]";
	}

	public int getOcena() {
		return ocena;
	}

	public void setOcena(int ocena) {
		this.ocena = ocena;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Long getKlinikaID() {
		return klinikaID;
	}

	public void setKlinikaID(Long klinikaID) {
		this.klinikaID = klinikaID;
	}

	public String getTelefon() {
		return telefon;
	}

	public void setTelefon(String telefon) {
		this.telefon = telefon;
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

	public String getLozinka() {
		return lozinka;
	}

	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
	
}
