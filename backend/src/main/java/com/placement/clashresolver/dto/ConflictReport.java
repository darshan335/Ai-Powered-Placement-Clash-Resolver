package com.placement.clashresolver.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConflictReport {

    private Long drive1Id;

    private String company1;

    private Long drive2Id;

    private String company2;

    private String date;

    private String startTime1;

    private String endTime1;

    private String startTime2;

    private String endTime2;

    private int affectedStudentCount;

    private String severity;
}