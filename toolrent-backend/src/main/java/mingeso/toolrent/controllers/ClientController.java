package mingeso.toolrent.controllers;

import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@CrossOrigin("*")
public class ClientController {
    @Autowired
	ClientService clientService;

    @GetMapping("/")
	public ResponseEntity<List<ClientEntity>> listClients() {
    	List<ClientEntity> clients = clientService.getClients();
		return ResponseEntity.ok(clients);
	}

  @GetMapping("/available")
	public ResponseEntity<List<ClientEntity>> listAvailableClients() {
    	List<ClientEntity> clients = clientService.getAvailableClients();
		return ResponseEntity.ok(clients);
	}

	@GetMapping("/{rut}")
	public ResponseEntity<ClientEntity> getClientByRut(@PathVariable String rut) {
		ClientEntity client = clientService.getClientByRut(rut);
		return ResponseEntity.ok(client);
	}

	@PostMapping("/")
	public ResponseEntity<ClientEntity> saveClient(@RequestBody ClientEntity client) {
		ClientEntity clientNew = clientService.saveClient(client);
		return ResponseEntity.ok(clientNew);
	}

	@PutMapping("/")
	public ResponseEntity<ClientEntity> updateClient(@RequestBody ClientEntity client){
		ClientEntity clientUpdated = clientService.updateClient(client);
		return ResponseEntity.ok(clientUpdated);
	}

	@DeleteMapping("/{rut}")
	public ResponseEntity<Void> deleteClientByRut(@PathVariable String rut) throws Exception {
		clientService.deleteClient(rut);
		return ResponseEntity.noContent().build();
	}
}