package mingeso.toolrent.services;

import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.ArrayList;

@Service
public class ClientService {
    @Autowired
    ClientRepository clientRepository;

    public ArrayList<ClientEntity> getCategories(){
        return (ArrayList<ClientEntity>) clientRepository.findAll();
    }

    public ClientEntity saveClient(ClientEntity client){
        if (client.getActiveLoans() == null) {
            client.setActiveLoans(0);
        }
        return clientRepository.save(client);
    }

    public ClientEntity getClientByRut(String clientRut){
        return clientRepository.findByClientRut(clientRut);
    }

    public ClientEntity updateClient(ClientEntity client) {
        var currentLoans = clientRepository.findByClientRut(client.getClientRut()).getActiveLoans();
        if (client.getActiveLoans() == null && currentLoans == null) {
            client.setActiveLoans(0);
        } else {
            client.setActiveLoans(currentLoans);
        }
        return clientRepository.save(client);
    }

    @Transactional
    public boolean deleteClient(String clientRut) throws Exception {
        try{
            clientRepository.deleteByClientRut(clientRut);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }
}