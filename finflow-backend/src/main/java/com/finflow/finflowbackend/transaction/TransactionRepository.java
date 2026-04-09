package com.finflow.finflowbackend.transaction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    //Find all transactions belong to an account
    List<Transaction> findAllByAccount_IdOrderByPostedDateDesc(UUID accountId);
}
