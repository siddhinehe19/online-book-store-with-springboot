package com.dhanshri.bookstore.controller;

import com.dhanshri.bookstore.model.Book;
import com.dhanshri.bookstore.repository.BookRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookRepository books;

    public BookController(BookRepository books) { this.books = books; }

    @GetMapping
    public List<Book> all(@RequestParam(required=false) String q,
                          @RequestParam(required=false) String category) {
        if (q != null && !q.isBlank()) return books.search(q);
        if (category != null && !category.isBlank()) return books.findByCategoryIgnoreCase(category);
        return books.findAll();
    }

    @GetMapping("/{id}")
    public Book one(@PathVariable Long id) {
        return books.findById(id).orElseThrow();
    }
}
