import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, sha256, ADMIN_LOGIN, ADMIN_PASSWORD_HASH } from './supabase';
import * as XLSX from 'xlsx';
import './App.css';

// ==================== SVG ИКОНКИ ====================
const VKIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.714-1.033-1.033-1.49-1.171-1.744-1.171-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.864 2.491 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
  </svg>
);

const FileExcelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="M8 13h2"/>
    <path d="M8 17h2"/>
    <path d="M14 13h2"/>
    <path d="M14 17h2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const LogInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ==================== МОДАЛЬНОЕ ОКНО ====================
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// ==================== ГЛАВНОЕ ПРИЛОЖЕНИЕ ====================
function App() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [memberEvents, setMemberEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Модальные окна
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [linkingMember, setLinkingMember] = useState(null);

  // Формы
  const [memberForm, setMemberForm] = useState({ full_name: '', position: '', phone: '', vk_link: '' });
  const [eventForm, setEventForm] = useState({ title: '', event_date: '', vk_post_link: '' });
  const [selectedEvents, setSelectedEvents] = useState([]);

  // Проверяем сессию при загрузке
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAdmin(true);
      }
    };
    checkSession();
  }, []);

  // Загрузка данных
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: membersData }, { data: eventsData }, { data: meData }] = await Promise.all([
        supabase.from('members').select('*').order('full_name'),
        supabase.from('events').select('*').order('event_date', { ascending: false }),
        supabase.from('member_events').select('*')
      ]);
      setMembers(membersData || []);
      setEvents(eventsData || []);
      setMemberEvents(meData || []);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Подписка на изменения в реальном времени
  useEffect(() => {
    const channels = [
      supabase.channel('members-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, loadData)
        .subscribe(),
      supabase.channel('events-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, loadData)
        .subscribe(),
      supabase.channel('me-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'member_events' }, loadData)
        .subscribe()
    ];
    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [loadData]);

  // ==================== АВТОРИЗАЦИЯ ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    const passwordHash = await sha256(loginForm.password);

    if (loginForm.login !== ADMIN_LOGIN || passwordHash !== ADMIN_PASSWORD_HASH) {
      setLoginError('Неверный логин или пароль');
      return;
    }

    // Создаём анонимную сессию для прохождения RLS
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      setLoginError('Ошибка авторизации: ' + error.message);
      return;
    }

    setIsAdmin(true);
    setShowLoginModal(false);
    setLoginForm({ login: '', password: '' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  // ==================== CRUD УЧАСТНИКИ ====================
  const openMemberModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setMemberForm({
        full_name: member.full_name,
        position: member.position,
        phone: member.phone || '',
        vk_link: member.vk_link || ''
      });
    } else {
      setEditingMember(null);
      setMemberForm({ full_name: '', position: '', phone: '', vk_link: '' });
    }
    setShowMemberModal(true);
  };

  const saveMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await supabase.from('members').update(memberForm).eq('id', editingMember.id);
      } else {
        await supabase.from('members').insert([memberForm]);
      }
      setShowMemberModal(false);
      loadData();
    } catch (err) {
      alert('Ошибка сохранения: ' + err.message);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Удалить участника?')) return;
    await supabase.from('members').delete().eq('id', id);
    loadData();
  };

  // ==================== CRUD МЕРОПРИЯТИЯ ====================
  const openEventModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        event_date: event.event_date,
        vk_post_link: event.vk_post_link || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', event_date: '', vk_post_link: '' });
    }
    setShowEventModal(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await supabase.from('events').update(eventForm).eq('id', editingEvent.id);
      } else {
        await supabase.from('events').insert([eventForm]);
      }
      setShowEventModal(false);
      loadData();
    } catch (err) {
      alert('Ошибка сохранения: ' + err.message);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Удалить мероприятие?')) return;
    await supabase.from('events').delete().eq('id', id);
    loadData();
  };

  // ==================== СВЯЗЬ УЧАСТНИК-МЕРОПРИЯТИЕ ====================
  const openLinkModal = (member) => {
    setLinkingMember(member);
    const memberEventIds = memberEvents
      .filter(me => me.member_id === member.id)
      .map(me => me.event_id);
    setSelectedEvents(memberEventIds);
    setShowLinkModal(true);
  };

  const saveLinks = async () => {
    try {
      // Удаляем старые связи
      await supabase.from('member_events').delete().eq('member_id', linkingMember.id);

      // Добавляем новые
      if (selectedEvents.length > 0) {
        const newLinks = selectedEvents.map(eventId => ({
          member_id: linkingMember.id,
          event_id: eventId
        }));
        await supabase.from('member_events').insert(newLinks);
      }

      setShowLinkModal(false);
      loadData();
    } catch (err) {
      alert('Ошибка сохранения связей: ' + err.message);
    }
  };

  const toggleEventSelection = (eventId) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  // ==================== ЭКСПОРТ В EXCEL ====================
  const exportToExcel = () => {
    const data = members.map(member => {
      const memberEventIds = memberEvents.filter(me => me.member_id === member.id).map(me => me.event_id);
      const memberEventsList = events.filter(e => memberEventIds.includes(e.id));

      return {
        'ФИО': member.full_name,
        'Должность': member.position,
        'Телефон': member.phone || '-',
        'Ссылка ВК': member.vk_link || '-',
        'Количество мероприятий': memberEventsList.length,
        'Мероприятия': memberEventsList.map(e => `${e.title} (${e.event_date})`).join('; ')
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Участники');
    XLSX.writeFile(wb, 'Участники_ПО_Движения_Первых.xlsx');
  };

  // ==================== ВСПОМОГАТЕЛЬНЫЕ ====================
  const getMemberEvents = (memberId) => {
    const eventIds = memberEvents.filter(me => me.member_id === memberId).map(me => me.event_id);
    return events.filter(e => eventIds.includes(e.id)).sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
  };

  const totalMembers = members.length;
  const totalEvents = events.length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ==================== ШАПКА ==================== */}
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <div className="header-emblem">
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                <rect x="0" y="0" width="32" height="40" rx="4" fill="#0033A0"/>
                <text x="16" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">ПО</text>
              </svg>
            </div>
            <div className="header-text">
              <h1>Первичное отделение</h1>
              <p>Движения Первых — ТТИТ</p>
            </div>
          </div>
          <div className="header-actions">
            {isAdmin ? (
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOutIcon /> Выйти
              </button>
            ) : (
              <button className="btn btn-outline" onClick={() => setShowLoginModal(true)}>
                <LogInIcon /> Вход для администратора
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {/* ==================== СТАТИСТИКА ==================== */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Общее количество участников</h3>
              <p className="stat-value red">{totalMembers}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Проведено мероприятий</h3>
              <p className="stat-value blue">{totalEvents}</p>
            </div>
          </div>
        </section>

        {/* ==================== МЕРОПРИЯТИЯ (ПУБЛИЧНАЯ СЕКЦИЯ) ==================== */}
        <section className="events-section">
          <div className="section-header">
            <h2 className="section-title">Мероприятия</h2>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => openEventModal()}>
                <PlusIcon /> Добавить мероприятие
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <p className="empty-state">Пока нет мероприятий</p>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-card-content">
                    <h4 className="event-card-title">{event.title}</h4>
                    <p className="event-card-date">
                      {new Date(event.event_date).toLocaleDateString('ru-RU', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    {event.vk_post_link && (
                      <a 
                        href={event.vk_post_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="event-card-link"
                      >
                        <VKIcon /> Пост ВКонтакте
                      </a>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="event-card-actions">
                      <button className="btn-icon" onClick={() => openEventModal(event)} title="Редактировать">
                        <EditIcon />
                      </button>
                      <button className="btn-icon btn-icon-danger" onClick={() => deleteEvent(event.id)} title="Удалить">
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================== ТАБЛИЦА УЧАСТНИКОВ ==================== */}
        <section className="members-section">
          <div className="section-header">
            <h2 className="section-title">Участники</h2>
            <div className="section-actions">
              {isAdmin && (
                <>
                  <button className="btn btn-excel" onClick={exportToExcel}>
                    <FileExcelIcon /> Выгрузить в Excel
                  </button>
                  <button className="btn btn-primary" onClick={() => openMemberModal()}>
                    <PlusIcon /> Добавить участника
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>ФИО</th>
                  <th>Должность</th>
                  {isAdmin && <th>Телефон</th>}
                  {isAdmin && <th>Ссылка ВК</th>}
                  <th>Мероприятий</th>
                  <th>Мероприятия</th>
                  {isAdmin && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => {
                  const memberEventList = getMemberEvents(member.id);
                  return (
                    <tr key={member.id}>
                      <td>{index + 1}</td>
                      <td className="cell-name">{member.full_name}</td>
                      <td>{member.position}</td>
                      {isAdmin && <td>{member.phone || '-'}</td>}
                      {isAdmin && (
                        <td>
                          {member.vk_link ? (
                            <a href={member.vk_link} target="_blank" rel="noopener noreferrer" className="table-link">
                              <VKIcon /> Профиль
                            </a>
                          ) : '-'}
                        </td>
                      )}
                      <td className="cell-count">{memberEventList.length}</td>
                      <td className="cell-events">
                        {memberEventList.length === 0 ? (
                          <span className="text-muted">Нет мероприятий</span>
                        ) : (
                          <div className="event-list">
                            {memberEventList.map(event => (
                              <div key={event.id} className="event-list-item">
                                <span className="event-list-title">{event.title}</span>
                                <span className="event-list-date">
                                  {new Date(event.event_date).toLocaleDateString('ru-RU')}
                                </span>
                                {event.vk_post_link && (
                                  <a 
                                    href={event.vk_post_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="event-list-vk"
                                  >
                                    <VKIcon />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="cell-actions">
                          <button className="btn-icon" onClick={() => openLinkModal(member)} title="Мероприятия">
                            <PlusIcon />
                          </button>
                          <button className="btn-icon" onClick={() => openMemberModal(member)} title="Редактировать">
                            <EditIcon />
                          </button>
                          <button className="btn-icon btn-icon-danger" onClick={() => deleteMember(member.id)} title="Удалить">
                            <TrashIcon />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {members.length === 0 && (
              <p className="empty-state">Пока нет участников</p>
            )}
          </div>
        </section>
      </main>

      {/* ==================== ФУТЕР ==================== */}
      <footer className="footer">
        <p>© 2026 Первичное отделение Движения Первых — Томский техникум информационных технологий</p>
      </footer>

      {/* ==================== МОДАЛЬНОЕ ОКНО: ВХОД ==================== */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} title="Вход для администратора">
        <form onSubmit={handleLogin} className="form">
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={loginForm.login}
              onChange={e => setLoginForm({...loginForm, login: e.target.value})}
              placeholder="Введите логин"
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="Введите пароль"
              required
            />
          </div>
          {loginError && <p className="form-error">{loginError}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Войти</button>
          </div>
        </form>
      </Modal>

      {/* ==================== МОДАЛЬНОЕ ОКНО: УЧАСТНИК ==================== */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title={editingMember ? 'Редактировать участника' : 'Добавить участника'}>
        <form onSubmit={saveMember} className="form">
          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              value={memberForm.full_name}
              onChange={e => setMemberForm({...memberForm, full_name: e.target.value})}
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>
          <div className="form-group">
            <label>Должность *</label>
            <input
              type="text"
              value={memberForm.position}
              onChange={e => setMemberForm({...memberForm, position: e.target.value})}
              placeholder="Например: Руководитель отделения"
              required
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              value={memberForm.phone}
              onChange={e => setMemberForm({...memberForm, phone: e.target.value})}
              placeholder="+7 (999) 999-99-99"
            />
          </div>
          <div className="form-group">
            <label>Ссылка ВКонтакте</label>
            <input
              type="url"
              value={memberForm.vk_link}
              onChange={e => setMemberForm({...memberForm, vk_link: e.target.value})}
              placeholder="https://vk.com/id123456"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Отмена</button>
            <button type="submit" className="btn btn-primary">{editingMember ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </form>
      </Modal>

      {/* ==================== МОДАЛЬНОЕ ОКНО: МЕРОПРИЯТИЕ ==================== */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title={editingEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие'}>
        <form onSubmit={saveEvent} className="form">
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={eventForm.title}
              onChange={e => setEventForm({...eventForm, title: e.target.value})}
              placeholder="Название мероприятия"
              required
            />
          </div>
          <div className="form-group">
            <label>Дата *</label>
            <input
              type="date"
              value={eventForm.event_date}
              onChange={e => setEventForm({...eventForm, event_date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Ссылка на пост ВКонтакте</label>
            <input
              type="url"
              value={eventForm.vk_post_link}
              onChange={e => setEventForm({...eventForm, vk_post_link: e.target.value})}
              placeholder="https://vk.com/wall-123456_789"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>Отмена</button>
            <button type="submit" className="btn btn-primary">{editingEvent ? 'Сохранить' : 'Добавить'}</button>
          </div>
        </form>
      </Modal>

      {/* ==================== МОДАЛЬНОЕ ОКНО: СВЯЗЬ МЕРОПРИЯТИЙ ==================== */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title={`Мероприятия: ${linkingMember?.full_name || ''}`}>
        <div className="link-events-list">
          {events.length === 0 ? (
            <p className="empty-state">Нет доступных мероприятий</p>
          ) : (
            events.map(event => (
              <label key={event.id} className="link-event-item">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => toggleEventSelection(event.id)}
                />
                <span className="link-event-title">{event.title}</span>
                <span className="link-event-date">{new Date(event.event_date).toLocaleDateString('ru-RU')}</span>
              </label>
            ))
          )}
        </div>
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => setShowLinkModal(false)}>Отмена</button>
          <button className="btn btn-primary" onClick={saveLinks}>Сохранить</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
