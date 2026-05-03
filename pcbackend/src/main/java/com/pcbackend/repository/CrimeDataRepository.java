package com.pcbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pcbackend.model.CrimeData;
@Repository
public interface CrimeDataRepository extends JpaRepository<CrimeData,Long>{
	

}
