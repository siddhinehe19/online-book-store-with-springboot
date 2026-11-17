package com.dhanshri.bookstore.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderRequest(
    @NotEmpty List<Long> bookIds,
    @NotNull Double total
) {}
