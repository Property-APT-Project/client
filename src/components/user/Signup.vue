<script setup>
import Logo from "./Logo.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

function openPostcode() {
  new window.daum.Postcode({
    oncomplete: (d) => {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분
      address.value.zonecode = d.zonecode;
      address.value.roadAddress = d.roadAddress;
    },
  }).open();
}

const file = ref("");
async function uploadImage(event) {
  const files = event.target?.files;
  file.value = files[0];
  await base64(file.value);
}
function base64(file) {
  return new Promise((resolve) => {
    let a = new FileReader();
    a.onload = (e) => {
      resolve(e.target.result);
      const previewImage = document.getElementById("profileImage");
      previewImage.src = e.target.result;
    };

    a.readAsDataURL(file);
  });
}

const formData = ref({
  name: "",
  password: "",
  confirmPassword: "",
  address: "",
  phoneNumber: "",
  imgURL: "",
});

// EMAIL START //
const showEmailHint = ref(false);
const emailValid = ref(true);

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

watch(
  () => formData.value.email,
  (newEmail) => {
    emailValid.value = validateEmail(newEmail);
    showEmailHint.value = newEmail.length > 0 && !emailValid.value;
  }
);
// EMAIL END //

// PASSWORD START //
const showPasswordHint = ref(false);
const passwordValid = ref(false);
const passwordsMatch = ref(true);

const validatePassword = (password) => {
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
  const hasTwoSpecialChars =
    password.replace(/[^a-zA-Z0-9]/g, "").length <= password.length - 2;
  const isLongEnough = password.length >= 8;
  return hasNumber && hasLetter && hasTwoSpecialChars && isLongEnough;
};

watch(
  () => formData.value.password,
  (newPassword) => {
    passwordValid.value = validatePassword(newPassword);
    if (formData.value.confirmPassword != "") {
      passwordsMatch.value =
        formData.value.password === formData.value.confirmPassword;
    }
    if (passwordValid.value && passwordsMatch.value) {
      showPasswordHint.value = false;
    } else {
      showPasswordHint.value = true;
    }
  }
);

watch(
  () => formData.value.confirmPassword,
  (newConfirmPassword) => {
    passwordsMatch.value = formData.value.password === newConfirmPassword;
    if (passwordValid.value && passwordsMatch.value) {
      showPasswordHint.value = false;
    } else {
      showPasswordHint.value = true;
    }
  }
);
// PASSWORD END //

// PHONENUMBER START //
const phoneValid = ref(true);
const showPhoneHint = ref(false);

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^010-[0-9]{4}-[0-9]{4}$/;
  return phoneRegex.test(phoneNumber);
};

watch(
  () => formData.value.phoneNumber,
  (newPhoneNumber) => {
    phoneValid.value = validatePhoneNumber(newPhoneNumber);
    showPhoneHint.value = newPhoneNumber.length > 0 && !phoneValid.value;
  }
);
// PHONENUMBER END //

const address = ref({
  zonecode: "",
  roadAddress: "",
  detailAddress: "",
});

function validateForm() {
  emailValid.value = validateEmail(formData.value.email);
  passwordValid.value = validatePassword(formData.value.password);
  passwordsMatch.value =
    formData.value.password === formData.value.confirmPassword;
  phoneValid.value =
    !formData.value.phoneNumber ||
    validatePhoneNumber(formData.value.phoneNumber);

  showEmailHint.value = !emailValid.value;
  showPasswordHint.value = !passwordValid.value || !passwordsMatch.value;
  showPhoneHint.value =
    formData.value.phoneNumber.length > 0 && !phoneValid.value;

  return (
    emailValid.value &&
    passwordValid.value &&
    passwordsMatch.value &&
    phoneValid.value
  );
}

const {
  VITE_APP_API_SIGNUP,
  VITE_APP_API_MEMBER_UPLOAD,
  VITE_APP_API_DEFUALT_PROFILE_IMAGE,
} = import.meta.env;

const router = useRouter();
async function sendData() {
  formData.value.address = (
    address.value.zonecode +
    " " +
    address.value.roadAddress +
    " " +
    address.value.detailAddress
  ).trim();

  const form = new FormData();
  form.append("file", file.value);

  console.log("file" + file.value);
  await axios
    .post(VITE_APP_API_MEMBER_UPLOAD, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      formData.value.imgURL = response.data;
      console.log("Image uploaded successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  axios
    .post(VITE_APP_API_SIGNUP, formData.value)
    .then((response) => {
      console.log("Form submitted successfully:", response.data);
      Swal.fire({
        // title: "Good job!",
        text: "회원가입 되었습니다.",
        icon: "success",
      }).then(() => {
        router.push({ name: "loginForm" });
      });
    })
    .catch((error) => {
      Swal.fire({
        // title: "Good job!",
        title: "회원가입 실패",
        text: error.response.data,
        icon: "error",
      });
      console.error("Error:", error);
    });
}

const handleSubmit = () => {
  if (validateForm()) {
    sendData();
  } else {
    // Add shake class to invalid fields
    if (!emailValid.value) {
      document.getElementById("email").classList.add("shake");
      setTimeout(() => {
        document.getElementById("email").classList.remove("shake");
      }, 500);
    }
    if (!passwordValid.value || !passwordsMatch.value) {
      document.getElementById("password").classList.add("shake");
      document.getElementById("confirmPassword").classList.add("shake");
      setTimeout(() => {
        document.getElementById("password").classList.remove("shake");
        document.getElementById("confirmPassword").classList.remove("shake");
      }, 500);
    }
    if (formData.value.phoneNumber.length > 0 && !phoneValid.value) {
      document.getElementById("phoneNumber").classList.add("shake");
      setTimeout(() => {
        document.getElementById("phoneNumber").classList.remove("shake");
      }, 500);
    }
  }
};
</script>

<template>
  <div>
    <!--  Body Wrapper -->
    <div
      class="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div
        class="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center"
      >
        <div class="d-flex align-items-center justify-content-center w-100">
          <div class="row justify-content-center w-100">
            <div class="col-md-8 col-lg-6">
              <div class="card mb-0">
                <div class="card-body text-nowrap">
                  <Logo />
                  <h4 class="text-center text-black font-weight-bold">
                    회원가입하여 계정을 만드세요!
                  </h4>
                  <div class="row justify-content-center">
                    <div
                      class="col-4 d-flex align-items-center justify-content-center"
                    >
                      <div class="row">
                        <div class="col">
                          <img
                            :src="VITE_APP_API_DEFUALT_PROFILE_IMAGE"
                            id="profileImage"
                            class="card-img img-thumbnail rounded-circle"
                            alt="..."
                          />
                        </div>
                        <div class="d-flex mt-2 justify-content-center">
                          <label class="btn btn-light text-primary text-nowrap">
                            사진 등록/수정
                            <input
                              hidden
                              ref="image"
                              id="profileImageInput"
                              type="file"
                              name="image"
                              accept="image/*"
                              multiple="multiple"
                              @change="uploadImage"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <!-- <form> -->
                    <div
                      class="col-md d-flex flex-column justify-content-between"
                    >
                      <div class="mb-2">
                        <label for="email" class="form-label">아이디 *</label>
                        <input
                          v-model="formData.email"
                          type="email"
                          class="form-control"
                          id="email"
                          aria-describedby="emailHelp"
                          placeholder="이메일 주소 입력"
                        />
                        <div
                          v-if="showEmailHint && !emailValid"
                          class="email-hint ms-1"
                        >
                          유효한 이메일 주소를 입력하세요.
                        </div>
                      </div>

                      <div class="mb-2">
                        <label for="password" class="form-label"
                          >비밀번호 *</label
                        >
                        <input
                          v-model="formData.password"
                          type="password"
                          class="form-control"
                          id="password"
                          placeholder="비밀번호 입력"
                          @focus="showPasswordHint = true"
                        />
                        <div
                          v-if="showPasswordHint && !passwordValid"
                          class="password-hint ms-1"
                        >
                          비밀번호는 숫자, 영문자, 특수문자(2자리 이상)를 포함한
                          8자리 이상이어야 합니다.
                        </div>
                      </div>
                      <div class="mb-2">
                        <input
                          v-model="formData.confirmPassword"
                          type="password"
                          class="form-control"
                          id="confirmPassword"
                          placeholder="비밀번호 확인"
                        />
                        <div
                          v-if="showPasswordHint && !passwordsMatch"
                          class="password-hint"
                        >
                          비밀번호가 일치하지 않습니다.
                        </div>
                      </div>
                      <div class="mb-2">
                        <label for="name" class="form-label">이름</label>
                        <input
                          v-model="formData.name"
                          type="text"
                          class="form-control"
                          id="name"
                          placeholder="이름 입력"
                        />
                      </div>
                    </div>

                    <div
                      class="col-md d-flex flex-column justify-content-between"
                    >
                      <div class="mb-3">
                        <label for="address" class="form-label">주소</label>
                        <!-- <div> -->
                        <div class="row">
                          <div class="col">
                            <input
                              class="form-control mb-2"
                              type="text"
                              placeholder="우편번호"
                              v-model="address.zonecode"
                              readonly
                            />
                          </div>
                          <div class="col text-nowrap">
                            <button
                              class="btn btn-light text-primary mb-2"
                              id="postcode"
                              @click.self.prevent="openPostcode"
                            >
                              검색
                            </button>
                          </div>
                        </div>
                        <div class="mb-2">
                          <input
                            class="col form-control"
                            type="text"
                            v-model="address.roadAddress"
                            placeholder="주소"
                            readonly
                          />
                        </div>
                        <div class="mb-3">
                          <input
                            class="col form-control"
                            type="text"
                            v-model="address.detailAddress"
                            placeholder="상세주소"
                          />
                        </div>
                      </div>
                      <!-- </div> -->
                      <!-- <div class="mb-2">
                        <label for="address" class="form-label">주소</label>
                        <input type="text" class="form-control" id="address" placeholder="주소 입력">
                        </div> -->
                      <div class="mb-2 mt-1">
                        <label for="phoneNumber" class="form-label"
                          >휴대폰 번호</label
                        >
                        <input
                          v-model="formData.phoneNumber"
                          type="tel"
                          class="form-control"
                          id="phoneNumber"
                          placeholder="휴대폰 번호 입력"
                        />
                      </div>
                      <div
                        v-if="showPhoneHint && !phoneValid"
                        class="phone-hint"
                      >
                        휴대폰 번호는 010-XXXX-XXXX 형식이어야 합니다.
                      </div>
                    </div>
                    <div class="row justify-content-center">
                      <!-- <div class="col-4"></div> -->
                      <div class="col-md-8 ms-n2 mt-3">
                        <button
                          @click="handleSubmit"
                          class="btn btn-primary w-100 py-8 fs-4 mx-1 mb-4 rounded-2 text-center"
                        >
                          회원가입 완료
                        </button>
                      </div>
                    </div>

                    <div class="d-flex justify-content-around"></div>
                    <!-- </form> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  color: gray;
}

.font-weight-bold {
  font-weight: bold;
}

.password-hint,
.email-hint {
  color: #ff0000; /* 부트스트랩의 기본 텍스트 색상 */
  font-size: 0.875em; /* 폰트 크기를 약간 작게 설정 */
  margin-top: 0.5em; /* 위쪽 마진을 추가하여 간격 설정 */
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.5s;
  border: 1px solid red;
}

.rounded-circle {
  object-fit: cover;
}
</style>
