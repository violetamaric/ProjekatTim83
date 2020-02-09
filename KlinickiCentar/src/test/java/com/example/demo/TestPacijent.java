package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
//import static com.example.demo.PacijentKonstante.DB_ID;
//import static com.example.demo.PacijentKonstante.DB_IME;
//import static com.example.demo.PacijentKonstante.DB_PREZIME;
//import static com.example.demo.PacijentKonstante.DB_KOL;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.Charset;
import java.util.List;

import javax.annotation.PostConstruct;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.example.demo.controller.PacijentController;
import com.example.demo.dto.PacijentDTO;
import com.example.demo.model.Authority;
import com.example.demo.model.Klinika;
import com.example.demo.model.Pacijent;
import com.example.demo.security.TokenUtils;
import com.example.demo.service.KlinikaService;
import com.example.demo.service.PacijentService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestPropertySource("classpath:test.properties")
public class TestPacijent {
	
	@Autowired
	TokenUtils tokenUtils;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	PacijentController pacijentController;
	

	@Autowired
	private PacijentService pacijentService;
	
	
	@Autowired
	private KlinikaService klinikaService;

	
	public static final Long DB_ID = 1L;
	public static final String DB_IME = "Pera";
	public static final String DB_PREZIME = "Peric";
	public static final String DB_NOVO_IME = "PETAR";
	public static final String DB_NOVO_PREZIME = "PETROVIC";
	public static final int DB_KOL = 5;

	private static final String URL_PREFIX = "/api/pacijenti";

	private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
			MediaType.APPLICATION_JSON.getSubtype(), Charset.forName("utf8"));

	private MockMvc mockMvc;
	

	@Autowired
	private WebApplicationContext webApplicationContext;

	@PostConstruct
	public void setup() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}
//    @Test
//    public void myTestWithNoUser(){
//     this.mockMvc.perform(get(URL_PREFIX + "/findZK")).andExpect(status().isUnauthorized());
//    }
//
//	@Before
//	public void setUp() throws Exception {
//		klinikaService.save(new Klinika("P1", "O1", "GG",1));
//		klinikaService.save(new Klinika("P2","O2", "CC",2));
//		klinikaService.save(new Klinika("P3","O3", "FF",3));
//		klinikaService.save(new Klinika("P4","O4", "DD",4));
//		klinikaService.save(new Klinika("P5","O4", "HH",5));
//	}
	
	@Test(expected = ObjectOptimisticLockingFailureException.class)
	public void testOptimisticLockingScenario() {

		Klinika klinikaForUserOne = klinikaService.findById(1L);
		Klinika klinikaForUserTwo = klinikaService.findById(1L);

		//modifikovanje istog objekta
		klinikaForUserOne.setOcena(10);
		klinikaForUserTwo.setOcena(9);

		//verzija oba objekta je 0
		assertEquals(0, klinikaForUserOne.getVersion().intValue());
		assertEquals(0, klinikaForUserTwo.getVersion().intValue());

		//pokusaj cuvanja prvog objekta
		klinikaService.save(klinikaForUserOne);

		//pokusaj cuvanja drugog objekta - Exception!
		klinikaService.save(klinikaForUserTwo);
	}
	
	@Test
    @Transactional
    @Rollback(true)
	public void testGetAllPacijente() throws Exception {
		System.out.println("test get all pacijente");
		PacijentDTO pacijent2 = (PacijentDTO) (pacijentController.getPacijentByID(DB_ID)).getBody();
		System.out.println("*****************pacijent 2" + pacijent2);
		Pacijent pacijent = new Pacijent();
		pacijent.setId(DB_ID);
		pacijent.setIme(DB_NOVO_IME);
		pacijent.setPrezime(DB_NOVO_PREZIME);
		pacijent.setLbo(pacijent2.getLbo());
		pacijent.setEmail(pacijent2.getEmail());
		pacijent.setLozinka(pacijent2.getLozinka());
		pacijent.setAdresa(pacijent2.getAdresa());
		pacijent.setGrad(pacijent2.getGrad());
		pacijent.setDrzava(pacijent2.getDrzava());
		pacijent.setTelefon(pacijent2.getTelefon());
		pacijent.setOdobrenaRegistracija(pacijent2.getOdobrenaRegistracija());
		System.out.println("----------------pacijent 2" + pacijent2);
		
		Authority a = new Authority();
		a.setId(new Long(1L));
		a.setName(new String("PACIJENT"));

		System.out.println("????????????????????auth" + a);
		
		String jwt = tokenUtils.tokenPacijent(pacijent, a);
		assertNotNull(jwt);
		
		System.out.println("1111111");
	    final Authentication authentication = authenticationManager

				.authenticate(new UsernamePasswordAuthenticationToken(pacijent2.getEmail(),

						"pera"));
		System.out.println("1111111");
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		mockMvc.perform(get(URL_PREFIX + "/all").header("Authorization", jwt)).andExpect(status().isOk())
				.andExpect(content().contentType(contentType)).andExpect(jsonPath("$", hasSize(DB_KOL)))
				.andExpect(jsonPath("$.[*].id").value(hasItem(DB_ID.intValue())))
				.andExpect(jsonPath("$.[*].ime").value(hasItem(DB_IME)))
				.andExpect(jsonPath("$.[*].prezime").value(hasItem(DB_PREZIME)));
	}
	
	@Test
	public void testFindAll() {

		List<PacijentDTO> pacijenti = (pacijentController.getAll()).getBody();
		assertThat(pacijenti).hasSize(DB_KOL);
		assertThat(pacijenti).isNotEmpty();
	}

	@Test
	public void testFindByID() {
		PacijentDTO pacijent = (PacijentDTO) (pacijentController.getPacijentByID(DB_ID)).getBody();
		assertThat(pacijent).hasFieldOrProperty("email");
		assertThat(pacijent).isNotNull();
		assertThat(pacijent.getId()).isEqualTo(DB_ID);
		assertThat(pacijent.getIme()).isEqualTo(DB_IME);
		assertThat(pacijent.getPrezime()).isEqualTo(DB_PREZIME);
	}

	@Test
	@Transactional
	@Rollback(true)
	public void testUpdatePacijent() {
		PacijentDTO pacijent2 = (PacijentDTO) (pacijentController.getPacijentByID(DB_ID)).getBody();
		pacijent2.setId(DB_ID);
		pacijent2.setIme(DB_NOVO_IME);
		pacijent2.setPrezime(DB_NOVO_PREZIME);

		ResponseEntity<?> re = pacijentController.updatePacijent(pacijent2);
		
		PacijentDTO pacijent3 = (PacijentDTO)re.getBody();
		assertThat(pacijent3.getIme()).isEqualTo(DB_NOVO_IME);
		assertThat(pacijent3.getPrezime()).isEqualTo(DB_NOVO_PREZIME);
		assertThat(pacijent3.getId()).isEqualTo(DB_ID);
		assertThat(pacijent3).hasFieldOrProperty("email");
		assertThat(pacijent3).isNotNull();
	}

	@Test
	@Transactional
	@Rollback(true)
	public void testAddPacijent() {
		Pacijent pacijent = new Pacijent();
		pacijent.setIme(DB_NOVO_IME);
		pacijent.setPrezime(DB_NOVO_PREZIME);
		pacijent.setLbo("101");
		pacijent.setEmail("test@gmail.com");
		pacijent.setLozinka("test");
		pacijent.setAdresa("Temerinska 4");
		pacijent.setGrad("Novi Sad");
		pacijent.setDrzava("Srbija");
		pacijent.setTelefon("060789654");
		pacijent.setJmbg("0303966811711");
		pacijent.setOdobrenaRegistracija(2);
		
		int dbSizeBeforeAdd = (pacijentController.getAll()).getBody().size();

		Pacijent dbPacijent = pacijentService.save(pacijent);
		assertThat(dbPacijent).isNotNull();


		List<PacijentDTO> pacijenti = (pacijentController.getAll()).getBody();
		assertThat(pacijenti).hasSize(dbSizeBeforeAdd + 1);
		PacijentDTO pDTO = new PacijentDTO(dbPacijent);
		pDTO = pacijenti.get(pacijenti.size() - 1); 
		assertThat(pDTO.getIme()).isEqualTo(DB_NOVO_IME);
		assertThat(pDTO.getPrezime()).isEqualTo(DB_NOVO_PREZIME);
	}

	
	
}
