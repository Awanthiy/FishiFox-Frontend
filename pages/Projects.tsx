
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Search, MoreHorizontal, User, Folder, ArrowUpRight } from 'lucide-react';
import { db } from '../db';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Correctly fetch projects asynchronously in useEffect
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await db.getProjects();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Ventures</h1>
          <p className="text-slate-500 mt-2 font-medium italic">Transforming requirements into functional excellence.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white px-5 py-3 rounded-[1.5rem] border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Filter projects..." className="bg-transparent border-none outline-none text-sm px-3 w-48" />
          </div>
          <button className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
            <Plus size={20} />
            New Venture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-8 bento-card relative overflow-hidden group">
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000`}></div>
            
            <div className="flex justify-between items-start mb-8">
              <div className={`p-4 bg-primary/5 text-primary rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                <Folder size={26} />
              </div>
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                 }`}>
                   {project.status}
                 </span>
                 <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <Link to={`/projects/${project.id}`} className="block mb-2 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-900 hover:text-primary transition-colors tracking-tight">
                {project.name}
              </h3>
              <ArrowUpRight size={20} className="text-slate-300 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
            </Link>
            
            <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-8">
              <User size={16} />
              <span>{project.customer_name}</span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <span>Phase Progress</span>
                <span className={`text-primary`}>65%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 bg-primary shadow-[0_0_10px] shadow-primary/40`}
                  style={{ width: `65%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg shadow-slate-200">
                  {project.customer_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Entity</p>
                  <p className="text-xs font-black text-slate-800">{project.customer_name}</p>
                </div>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
                <Briefcase size={14} className="text-slate-400" />
                <span className="text-xs font-black text-slate-600">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
