package com.finflow.finflowbackend.transaction.mapper;

import com.finflow.finflowbackend.common.mapper.MoneyResponseMapper;
import com.finflow.finflowbackend.transaction.Transaction;
import com.finflow.finflowbackend.transaction.dto.TransactionDetailsOutDto;
import com.finflow.finflowbackend.transaction.dto.TransactionSummaryResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MoneyResponseMapper.class)
public interface TransactionResponseMapper {

    //Transaction -> TransactionDetailsOutDto
    @Mapping(source = "account.id", target = "accountId")
    @Mapping(source = "transactionMoney", target = "moneyResponse")
    @Mapping(source = "transactionCategory.id", target = "categoryId")
    TransactionDetailsOutDto toTransactionDetailsOutDto(Transaction transaction);

    //Transaction -> TransactionSummaryResponseDto
    @Mapping(source = "transactionMoney", target = "moneyResponse")
    @Mapping(source = "transactionCategory.id", target = "categoryId")
    @Mapping(source = "transactionCategory.name", target = "categoryName")
    TransactionSummaryResponseDto toTransactionSummaryResponseDto(Transaction transaction);
}
