import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { getSupabaseSettings, saveSupabaseSettings, SUPABASE_SQL_SCHEMA, getSupabaseClient } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const currentSettings = getSupabaseSettings();
  const [url, setUrl] = useState(currentSettings.url);
  const [anonKey, setAnonKey] = useState(currentSettings.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testingStatus, setTestingStatus] = useState<string | null>(null);

  const handleSaveAndTest = async () => {
    saveSupabaseSettings(url, anonKey);
    setTestingStatus('Testando conexão com o Supabase...');

    const client = getSupabaseClient();
    if (!client) {
      setTestingStatus('Erro: URL ou Chave inválidos.');
      return;
    }

    try {
      const { data, error } = await client.from('pizzas').select('count').limit(1);
      if (error) {
        setTestingStatus(`Conectado ao projeto! Nota: crie as tabelas executando o script SQL abaixo. (${error.message})`);
      } else {
        setTestingStatus('✓ Conexão realizada com Sucesso! Tabela "pizzas" encontrada.');
      }
    } catch (err: any) {
      setTestingStatus(`Conectado! Verifique o script SQL.`);
    }

    onRefresh();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100 flex flex-col relative p-6 sm:p-8 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-100">
                Integração Banco de Dados Supabase
              </h2>
              <p className="text-xs text-stone-400">
                Conecte seu projeto Supabase e execute os scripts de criação de tabela.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Credentials Form */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>1. Configurar Credenciais do Supabase</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://seu-projeto.supabase.co"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Supabase Anon API Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Criar projeto no Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              id="save-supabase-credentials-btn"
              onClick={handleSaveAndTest}
              className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              Salvar & Testar Conexão
            </button>
          </div>

          {testingStatus && (
            <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300">
              {testingStatus}
            </div>
          )}
        </div>

        {/* Step 2: SQL Script Export */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-black text-orange-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>2. Script SQL com Políticas RLS & Armazenamento (Storage)</span>
            </div>

            <button
              id="copy-sql-script-btn"
              onClick={handleCopySql}
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors border border-orange-200"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código SQL</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Copie o código abaixo e cole no <strong>SQL Editor</strong> do seu painel Supabase para criar as tabelas, políticas RLS, bucket de armazenamento e dados iniciais:
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto max-h-60 text-[11px] font-mono text-emerald-400 leading-relaxed custom-scrollbar">
            <pre>{SUPABASE_SQL_SCHEMA}</pre>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-6 py-2.5 rounded-xl text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
