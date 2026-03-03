package com.finflow.finflowbackend.dashboard.service;

import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.transaction.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }


}
