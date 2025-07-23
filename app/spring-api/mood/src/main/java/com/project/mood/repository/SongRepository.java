package com.project.mood.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.mood.entity.Song;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    @Query(value = "SELECT * FROM (\r\n" + //
            "    SELECT * FROM SONG WHERE TAG = ? ORDER BY DBMS_RANDOM.VALUE\r\n" + //
            ") WHERE ROWNUM <= 10", nativeQuery = true)
    // SELECT * FROM SONG WHERE TAG = ? ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 3
    // ROWS ONLY 11g이상이면 이거씀
    List<Song> findRandomSongsByTag(@Param("tag") String tag);
}