export function formatDetectionResponse(apiResponse: any) {
  return {
    label: apiResponse.label || "mixed",
    score: apiResponse.score || 0.5,
    reasons: apiResponse.reasons || ["No detailed reasons provided"],
  };
}