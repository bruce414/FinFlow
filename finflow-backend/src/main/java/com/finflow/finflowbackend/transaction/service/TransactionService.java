package com.finflow.finflowbackend.transaction.service;

import com.finflow.finflowbackend.transaction.TransactionRepository;
import com.finflow.finflowbackend.transaction.mapper.TransactionResponseMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionResponseMapper transactionResponseMapper;

    public TransactionService(TransactionRepository transactionRepository, TransactionResponseMapper transactionResponseMapper) {
        this.transactionRepository = transactionRepository;
        this.transactionResponseMapper = transactionResponseMapper;
    }
}
