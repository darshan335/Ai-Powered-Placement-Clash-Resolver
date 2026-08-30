package com.placement.clashresolver.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.placement.clashresolver.dto.AiRecommendationResponse;

@Service
public class AiRecommendationService {

	private final ChatClient chatClient;

	public AiRecommendationService(ChatClient.Builder chatClientBuilder) {
		this.chatClient = chatClientBuilder.build();
	}

	public AiRecommendationResponse analyzeConflict(String conflictDetails, int affectedStudentCount,
			String suggestedDate, String suggestedStartTime, String suggestedEndTime) {

		String prompt = """
				You are an AI assistant for a college placement office.

				Analyze the placement scheduling information provided below.

				IMPORTANT RULES:
				1. Do not invent or assume any facts.
				2. Do not change company names.
				3. Do not change dates or times.
				4. Do not change the affected student count.
				5. Use only the information provided.
				6. The affected student count was calculated by the Java backend.
				7. The suggested slot was calculated by the Java scheduling system.
				8. Your job is to explain the recommendation, not to recalculate the data.
				9. If there is a conflict, recommend the provided suggested slot.
				10. Keep the response concise and practical.

				Conflict information:
				%s

				Backend-calculated affected student count:
				%d

				Backend-calculated suggested slot:
				Date: %s
				Start time: %s
				End time: %s

				Return your response in exactly this format:

				RECOMMENDATION:
				<one concise recommendation>

				REASON:
				<short explanation based only on the supplied facts>
				""".formatted(conflictDetails, affectedStudentCount, suggestedDate, suggestedStartTime,
				suggestedEndTime);

		String aiResponse = chatClient.prompt().user(prompt).call().content();

		String recommendation = extractSection(aiResponse, "RECOMMENDATION:", "REASON:");

		String reason = extractSection(aiResponse, "REASON:", null);

		return new AiRecommendationResponse(recommendation, reason, affectedStudentCount, suggestedDate,
				suggestedStartTime, suggestedEndTime);
	}

	private String extractSection(String response, String startMarker, String endMarker) {

		int startIndex = response.indexOf(startMarker);

		if (startIndex == -1) {
			return response.trim();
		}

		startIndex += startMarker.length();

		int endIndex;

		if (endMarker != null) {
			endIndex = response.indexOf(endMarker, startIndex);
		} else {
			endIndex = response.length();
		}

		if (endIndex == -1) {
			endIndex = response.length();
		}

		return response.substring(startIndex, endIndex).trim();
	}
}