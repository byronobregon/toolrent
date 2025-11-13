package mingeso.toolrent.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mingeso.toolrent.dtos.PendingPenaltySummaryDto;
import mingeso.toolrent.entities.ClientEntity;
import mingeso.toolrent.entities.PenaltyEntity;
import mingeso.toolrent.repositories.ClientRepository;
import mingeso.toolrent.repositories.PenaltyRepository;

@Service
public class PenaltyService {

    private final PenaltyRepository penaltyRepository;
    private final ClientRepository clientRepository;

    public PenaltyService(PenaltyRepository penaltyRepository, ClientRepository clientRepository) {
        this.penaltyRepository = penaltyRepository;
        this.clientRepository = clientRepository;
    }

    public PendingPenaltySummaryDto getPendingSummary(String clientRut) {
        ClientEntity client = getClient(clientRut);
        Long totalPending = penaltyRepository.sumChargeByClientRutAndStatus(clientRut, "Pendiente");
        Long pendingCount = penaltyRepository.countByLoanClientClientRutAndStatus(clientRut, "Pendiente");
        return buildSummary(client, totalPending, pendingCount);
    }

    @Transactional
    public PendingPenaltySummaryDto payPendingPenalties(String clientRut) {
        ClientEntity client = getClient(clientRut);
        List<PenaltyEntity> pendingPenalties = penaltyRepository.findByLoanClientClientRutAndStatus(clientRut, "Pendiente");
        if (!pendingPenalties.isEmpty()) {
            pendingPenalties.forEach(penalty -> penalty.setStatus("Pagado"));
            penaltyRepository.saveAll(pendingPenalties);
        }
        return buildSummary(client, 0L, 0L);
    }

    private ClientEntity getClient(String clientRut) {
        return clientRepository.findByClientRut(clientRut)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado con rut: " + clientRut));
    }

    private PendingPenaltySummaryDto buildSummary(ClientEntity client, Long amount, Long count) {
        PendingPenaltySummaryDto dto = new PendingPenaltySummaryDto();
        dto.setClientRut(client.getClientRut());
        dto.setClientName(client.getName());
        dto.setPendingAmount(amount == null ? 0 : amount.intValue());
        dto.setPendingCount(count == null ? 0L : count);
        return dto;
    }
}
