package com.example.demo.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import javax.persistence.OneToOne;


import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
public class AdministratorKlinike implements UserDetails{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="ime", nullable=false)
	private String ime;
	
	@Column(name="prezime", nullable=false)
	private String prezime;
	

//	@Column(name="korisnickoIme", nullable=false)
//	private String korisnickoIme;
	
	@Column(name = "status", nullable = false)
	private int status;

	@Column(name="lozinka", nullable=false)
	private String lozinka;
	
	@Column(name="email", nullable=false)
	private String email;
	
	@Column(name="telefon", nullable=false)
	private String telefon;
	
	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private Klinika klinika; // samo id do klinike 
	
	
	
	@ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
	@JoinTable(name = "administrator_klinike_authority",
			joinColumns = @JoinColumn(name = "administrator_klinike_id", referencedColumnName = "id"),
			inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id"))
	private Set<Authority> authorities;
	
	//	private Set<Operacija> listaOperacija; //?? proveriti
//	
	
	
	public String getIme() {
		return ime;
	}
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
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

//	public String getKorisnickoIme() {
//		return korisnickoIme;
//	}
//	public void setKorisnickoIme(String korisnickoIme) {
//		this.korisnickoIme = korisnickoIme;
//	}

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
	public Klinika getKlinika() {
		return klinika;
	}
	public void setKlinika(Klinika klinika) {
		this.klinika = klinika;
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
	//	public Set<Pregled> getListaPregleda() {
//		return listaPregleda;
//	}
//	public void setListaPregleda(Set<Pregled> listaPregleda) {
//		this.listaPregleda = listaPregleda;
//	}
//	public Set<Operacija> getListaOperacija() {
//		return listaOperacija;
//	}
//	public void setListaOperacija(Set<Operacija> listaOperacija) {
//		this.listaOperacija = listaOperacija;
//	}
	public AdministratorKlinike() {
		super();
	}
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		return super.equals(obj);
	}
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return super.hashCode();
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return super.toString();
	}
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return this.authorities;
	}
	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return lozinka;
	}
	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return email;
	}
	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}
	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}
	public void setAuthorities(Set<Authority> authorities) {
		this.authorities = authorities;
	}

	
	
	
}
