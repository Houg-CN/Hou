/**
 * 简历交互脚本
 * - 头像上传预览
 * - 内容可编辑（双击）
 * - 滚动动画触发
 */

(function () {
  'use strict';

  initAvatarUpload();
  initEditableContent();
  initScrollReveal();

  /** 头像点击上传 */
  function initAvatarUpload() {
    const avatar = document.getElementById('avatarPlaceholder');
    if (!avatar) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    avatar.style.cursor = 'pointer';
    avatar.title = '点击上传头像';

    avatar.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        avatar.innerHTML = '';
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.alt = '头像';
        avatar.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  /** 双击编辑内容 — 方便快速修改文字 */
  function initEditableContent() {
    const editableSelectors = [
      '.name', '.title-role',
      '.contact-item',
      '.summary-text',
      '.skill-category', '.tag',
      '.edu-degree', '.edu-school', '.edu-date',
      '.exp-company', '.exp-role', '.exp-date',
      '.exp-list li',
      '.lang-name', '.lang-level'
    ];

    const elements = document.querySelectorAll(editableSelectors.join(','));

    elements.forEach((el) => {
      el.addEventListener('dblclick', () => {
        el.setAttribute('contenteditable', 'true');
        el.focus();
        el.classList.add('editing');

        const onBlur = () => {
          el.removeAttribute('contenteditable');
          el.classList.remove('editing');
          el.removeEventListener('blur', onBlur);
        };
        el.addEventListener('blur', onBlur);
      });
    });

    const style = document.createElement('style');
    style.textContent = `
      .editing {
        outline: 2px dashed var(--color-primary) !important;
        outline-offset: 2px;
        border-radius: 3px;
        background: rgba(0, 0, 0, .03);
      }
    `;
    document.head.appendChild(style);
  }

  /** 滚动进入视口时触发动画 */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => {
      s.style.animationPlayState = 'paused';
      observer.observe(s);
    });
  }
})();
