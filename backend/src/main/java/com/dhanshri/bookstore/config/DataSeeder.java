package com.dhanshri.bookstore.config;

import com.dhanshri.bookstore.model.Book;
import com.dhanshri.bookstore.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedBooks(BookRepository repo) {

        return args -> {

            if (repo.count() > 0) {
                return;
            }

            Book book1 = new Book();
            book1.setTitle("Atomic Habits");
            book1.setAuthor("James Clear");
            book1.setDescription(
                    "A practical guide to building good habits and breaking bad ones."
            );
            book1.setPrice(499.0);
            book1.setOriginalPrice(699.0);
            book1.setCategory("Self Help");
            book1.setImageUrl(
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
            );
            book1.setStock(25);
            book1.setRating(4.8);
            book1.setReviewCount(1250);


            Book book2 = new Book();
            book2.setTitle("The Psychology of Money");
            book2.setAuthor("Morgan Housel");
            book2.setDescription(
                    "Timeless lessons on wealth, greed, happiness and financial decisions."
            );
            book2.setPrice(399.0);
            book2.setOriginalPrice(550.0);
            book2.setCategory("Finance");
            book2.setImageUrl(
                    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80"
            );
            book2.setStock(18);
            book2.setRating(4.7);
            book2.setReviewCount(980);


            Book book3 = new Book();
            book3.setTitle("Ikigai");
            book3.setAuthor("Héctor García & Francesc Miralles");
            book3.setDescription(
                    "A thoughtful exploration of purpose, balance and the Japanese concept of ikigai."
            );
            book3.setPrice(299.0);
            book3.setOriginalPrice(450.0);
            book3.setCategory("Lifestyle");
            book3.setImageUrl(
                    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
            );
            book3.setStock(30);
            book3.setRating(4.6);
            book3.setReviewCount(760);


            Book book4 = new Book();
            book4.setTitle("The Alchemist");
            book4.setAuthor("Paulo Coelho");
            book4.setDescription(
                    "A timeless story about dreams, courage and following your own path."
            );
            book4.setPrice(249.0);
            book4.setOriginalPrice(350.0);
            book4.setCategory("Fiction");
            book4.setImageUrl(
                    "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=600&q=80"
            );
            book4.setStock(22);
            book4.setRating(4.8);
            book4.setReviewCount(1400);


            Book book5 = new Book();
            book5.setTitle("Deep Work");
            book5.setAuthor("Cal Newport");
            book5.setDescription(
                    "Rules for focused success in a distracted world."
            );
            book5.setPrice(449.0);
            book5.setOriginalPrice(599.0);
            book5.setCategory("Productivity");
            book5.setImageUrl(
                    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80"
            );
            book5.setStock(14);
            book5.setRating(4.5);
            book5.setReviewCount(620);


            Book book6 = new Book();
            book6.setTitle("Rich Dad Poor Dad");
            book6.setAuthor("Robert T. Kiyosaki");
            book6.setDescription(
                    "A classic personal-finance book about money, investing and financial literacy."
            );
            book6.setPrice(329.0);
            book6.setOriginalPrice(499.0);
            book6.setCategory("Finance");
            book6.setImageUrl(
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80"
            );
            book6.setStock(20);
            book6.setRating(4.6);
            book6.setReviewCount(1120);


            repo.saveAll(List.of(
                    book1,
                    book2,
                    book3,
                    book4,
                    book5,
                    book6
            ));
        };
    }
}