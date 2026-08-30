package com.placement.clashresolver.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleCheckResponse {

    private boolean canSchedule;

    private String message;

    private List<ConflictReport> conflicts;
}