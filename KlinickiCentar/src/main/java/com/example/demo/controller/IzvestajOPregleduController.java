package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.IzvestajOPregleduDTO;
import com.example.demo.model.Dijagnoza;
import com.example.demo.model.IzvestajOPregledu;
import com.example.demo.model.Lek;
import com.example.demo.model.Lekar;
import com.example.demo.model.Pacijent;
import com.example.demo.model.Pregled;
import com.example.demo.model.Recept;
import com.example.demo.model.ZdravstveniKarton;
import com.example.demo.service.DijagnozaService;
import com.example.demo.service.IzvestajOPregleduService;
import com.example.demo.service.LekService;
import com.example.demo.service.LekarService;
import com.example.demo.service.PacijentService;
import com.example.demo.service.PregledService;
import com.example.demo.service.ReceptService;
import com.example.demo.service.ZdravstveniKartonService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/api/izvestajOP", produces = MediaType.APPLICATION_JSON_VALUE)
public class IzvestajOPregleduController {
	@Autowired
	private IzvestajOPregleduService izvestajService;
	
	@Autowired
	private PregledService pregledService;
	@Autowired
	private LekarService lekarService;
	@Autowired
	private PacijentService pacijentService;
	@Autowired
	private DijagnozaService dijagnozaService;
	@Autowired
	private LekService lekService;
	@Autowired
	private ReceptService receptService;
	@Autowired
	private ZdravstveniKartonService zdravstveniKartonService;
	
	
	@PostMapping(path = "/zavrsetakPregleda", consumes = "application/json")
	@CrossOrigin(origins = "http://localhost:3000")
	@PreAuthorize("hasAuthority('LEKAR')")
	public ResponseEntity<String> zavrsetakPregleda(@RequestBody IzvestajOPregleduDTO izDTO) {
		System.out.println("------------------------------------------------------");
		
		IzvestajOPregledu iz = new IzvestajOPregledu();
		
		
		//PREGLED
		
		Pregled pregled = pregledService.findById(izDTO.getPregledID());
		pregled.setStatus(3); //zavrsen pregled
		
		Lekar lekar = pregled.getLekar();
		
		Pacijent paci = pregled.getPacijent();
		int flag = 0;
		for(Pacijent pac : lekar.getListaPacijenata()) {
			if(pac.getId().equals(paci.getId())) {
				flag = 1;
				System.out.println("ISPIS FLAG  JE 1");
				break;
			}
		}
		for(Lekar lek : paci.getListaLekara()) {
			if(lek.equals(lekar)) {
				flag = 2;
				System.out.println("ISPIS FLAG  JE 2");
				break;
			}
		}
		System.out.println("Vrednost flaga : " + flag);
		
		
		//ne radi ovo izbacuje gresku 
		if(flag == 0) {
			
			lekar.getListaPacijenata().add(paci);
			
			paci.getListaLekara().add(lekar);
			
			paci = pacijentService.save(paci);
			
			lekar =  lekarService.save(lekar);
		}

		Pacijent pacijent = pregled.getPacijent();
		iz.setPregled(pregled);
		
		//ZDRAVSTVENI KARTON
		ZdravstveniKarton zk = pacijent.getZdravstveniKarton();
		iz.setZdravstveniKarton(zk);
		
		//DIJAGNOZA
		Dijagnoza dijagnoza = dijagnozaService.findById(izDTO.getDijagnozaID());
		iz.setDijagnoza(dijagnoza);
		
		
		
		//RECEPTI
		
		List<Long> recepti = izDTO.getRecepti();
		for(Long id : recepti) {
			Recept r = new Recept();
			r.setIzvestajOPregledu(iz);
			r.setOveren(false);
			
			Lek l = lekService.findById(id);
			r.setLek(l);
			
			//medicinska sestra nije dodeljena
	
			r = receptService.save(r);
			iz.getListaRecepata().add(r);
		}
		
		
		
		iz.setSadrzaj(izDTO.getSadrzaj());
		
		iz = izvestajService.save(iz);
		
		pregled.setIzvestajOPregledu(iz);
		pregled = pregledService.save(pregled); 
		 

		zk.getListaIzvestajaOPregledu().add(iz);
		zk = zdravstveniKartonService.save(zk);
		
		
		dijagnoza.getListaIzvestajaOPregledu().add(iz);
		dijagnoza = dijagnozaService.save(dijagnoza);
		

		System.out.println("------------------------------------------------------");
		return new ResponseEntity<>("Uspesno", HttpStatus.CREATED);
	}


}
