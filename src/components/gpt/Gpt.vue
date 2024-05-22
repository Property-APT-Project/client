<template>
  <div>
    <h1>Find Apartments</h1>
    <input v-model="keyword" placeholder="Enter keyword" />
    <button @click="fetchApartments">Search</button>
    <ul>
      <li v-for="(apartment, index) in apartments" :key="index">
        {{ apartment }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const keyword = ref("");
const apartments = ref([]);

const fetchApartments = async () => {
  if (!keyword.value.trim()) {
    alert("Please enter a keyword.");
    return;
  }

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = "sk-proj-7YHyfeiXw0IEvk3DjS9XT3BlbkFJUYSml7X6eGhD7oTk77tp"; // 여기에 실제 OpenAI API 키를 입력하세요.

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o",
        messages: [
          // { role: "assistant", content: "넌 부동산 데이터를 잘 아는 도우미야." },
          {
            role: "user",
            content: `${keyword.value}와 관련된 실제 한국 아파트 이름 한개 이름 공백 없이 적어줘 `,
          },
        ],
        // max_tokens: 50,
        // n: 1,
        // stop: ["\n"],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data.choices[0].message.content.trim();
    console.log(responseData);
    apartments.value = responseData
      .split("\n")
      .filter((line) => line.trim() !== "");
  } catch (error) {
    console.error("Error fetching apartments:", error);
    alert("Failed to fetch apartments. Please try again later.");
  }
};
</script>

<style scoped>
h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}
input {
  padding: 8px;
  margin-right: 8px;
}
button {
  padding: 8px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>
