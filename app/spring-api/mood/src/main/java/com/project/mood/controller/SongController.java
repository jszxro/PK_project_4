package com.project.mood.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mood.entity.Song;
import com.project.mood.repository.SongRepository;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    @Autowired
    private SongRepository songRepository;

    @GetMapping("/{tag}")
    public ResponseEntity<List<Song>> getSongsByTag(@PathVariable("tag") String tag) {
        List<Song> songs = songRepository.findRandomSongsByTag(tag);
        System.out.println(songs);
        return ResponseEntity.ok(songs);
    }
}